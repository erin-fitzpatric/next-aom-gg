import { TokenSet } from "openid-client";
import { OIDCConfig, OAuthConfig } from "next-auth/providers";
import QueryString from "querystring"

export interface XboxLiveProfile extends Record<string, any> {
    id: string,
    name: string
    image?: string
  }

  async function requestXboxUserToken(accessToken: string) {
    const headers = new Headers({
       "x-xbl-contract-version": "1",
       "Content-Type": "application/json" 
    })

    const data = {
        "RelyingParty": "http://auth.xboxlive.com",
        "TokenType": "JWT",
        "Properties": {
            "AuthMethod": "RPS",
            "SiteName": "user.auth.xboxlive.com",
            "RpsTicket": `d=${accessToken}`
        }
    }

    const resp = await fetch("https://user.auth.xboxlive.com/user/authenticate", {
        method: "POST",
        headers,
        body: JSON.stringify(data),
    })

    if (resp.ok) {
        const tokenData = await resp.json()
        return tokenData
    } else {
        throw new Error(`Failed to get Xbox User Token ${await resp.text()}`)
    }
  }


  async function requestXSTSToken(userToken: string) {
    const headers = new Headers({
       "x-xbl-contract-version": "1",
       "Content-Type": "application/json" 
    })

    const data = {
        "RelyingParty": "http://xboxlive.com",
        "TokenType": "JWT",
        "Properties": {
            "UserTokens": [userToken],
            "SandboxId": "RETAIL",
        },
    }

    const resp = await fetch("https://xsts.auth.xboxlive.com/xsts/authorize", {
        method: "POST",
        headers,
        body: JSON.stringify(data),
    })

    if (resp.ok) {
        const tokenData = await resp.json()
        return tokenData
    }
    throw new Error(`Failed to get XSTS Token ${await resp.text()}`)
  }

  async function requestXBLUserData(xstsToken: string) {
    const headers = new Headers({
        "x-xbl-contract-version": "3",
        //"Content-Type": "application/json",
        "Authorization": xstsToken,
        "Accept-Language": "en-us"
     })

     const settings = [
        "GameDisplayName",
        "GameDisplayPicRaw",
        "Gamerscore",
        "Gamertag"
     ]

     const params = {
        Settings: settings
     }

     //https://learn.microsoft.com/en-us/gaming/gdk/_content/gc/reference/live/rest/uri/profilev2/uri-usersuseridprofilesettingspeopleuserlistget
     const resp = await fetch("https://profile.xboxlive.com/users/me/profile/settings?" + QueryString.stringify(params), {
        method: "GET",
        headers
     })

     if (resp.ok) {
        return await resp.json()
     }
     throw new Error(`Unable to get XBL User Data ${resp.status} "${await resp.text()}"`)
}

  export default function Xbox(config: {}) : OAuthConfig<XboxLiveProfile> {
    return {
        id: "xbox",
        name: "Xbox Live",
        type: "oauth",
        authorization: {
            url: "https://login.live.com/oauth20_authorize.srf",
            params: {
                approval_prompt: "auto",
                scope: "Xboxlive.signin Xboxlive.offline_access"
            }
        },
        token: "https://login.live.com/oauth20_token.srf",
        userinfo: {
            url: "https://user.auth.xboxlive.com/user/authenticate",
            async request({ profile, tokens } : { profile: OIDCConfig<XboxLiveProfile>, tokens: TokenSet }) {
                if (!tokens.access_token) throw new Error("Help no token!")
    
                const userTokenData = await requestXboxUserToken(tokens.access_token)
    
                const userHash = userTokenData?.DisplayClaims?.xui?.[0]?.uhs

                if (!userHash) {
                    throw new Error("Unable to get Xbox User Hash")
                }

                const xstsTokenData = await requestXSTSToken(userTokenData.Token)

                const xstsToken = xstsTokenData.Token

                if (!xstsToken) {
                    throw new Error("Unable to get XSTS Token")
                }

                const xblToken = `XBL3.0 x=${userHash};${xstsToken}`

                const data = await requestXBLUserData(xblToken)

                const user = data.profileUsers[0]

                if (!user) throw new Error("This guy doesn't have users!")

                const gamerTag = user.settings.find((s: any) => s.id == "Gamertag")?.value
                const profilePic = user.settings.find((s: any) => s.id == "GameDisplayPicRaw")?.value

                if (!gamerTag) throw new Error("Unable to get gamertag")

                return {
                    id: user.id,
                    xuid: user.id,
                    name: gamerTag,
                    image: profilePic ?? null
                }
            }
        },
        async profile(profile) {
           return profile
        },
    }
  }