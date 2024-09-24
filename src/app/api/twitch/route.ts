import twitchLive from "@/server/controllers/twitch-live";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url); 
    const userId = searchParams.get('userId') || "";


    try {
        const res = await twitchLive({ userId });
        const userName = res.twitchUrl.split('/').pop(); 
        const clientId = process.env.TWITCH_CLIENT_ID;
        const accessToken = process.env.TWITCH_ACCESS_TOKEN;

        if (!clientId || !accessToken) {
            throw new Error("Twitch credentials are not defined");
        }

        const liveStreamData = await fetch(`https://api.twitch.tv/helix/streams?user_login=${userName}`, {
            headers: {
                "Client-ID": clientId,
                "Authorization": `Bearer ${accessToken}`
            }
        });

        const data = await liveStreamData.json();
        const isLive = data.data.length > 0;
        return Response.json({ isLive });
    } catch (err) {
        console.error("Error in GET function:", err);
        return Response.json({ Message: "Failed to fetch Twitch data." }, { status: 500 });
    }
}
