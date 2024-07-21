// These strings currently must match those stored inside recorded games
// A recorded game lacking any of these will throw an error
// Any metadata in a recorded game not included here will be ignored - keys that aren't useful can just be removed
export const RecordedGamePlayerMetadataStrings = [
    "name", 
    "clan",             // Unused in beta
    "rank",             // Unused
    "winratio",         // Unused
    "civlist",          // Unknown format, most likely somehow contains which random god(s) the player selected
    "powerrating",      // Unused
    "aotgblessings",    // Unknown, "aotg" is probably arena of the gods - can't tell from beta alone
    "pfentity",         // Unknown
    "aipersonality",
    "avatarid",     
] as const;

export const RecordedGamePlayerMetadataNumbers = [
    "teamid", 
    "civ",
    "rating",           // Unused in beta
    "color",         
    "handicap",                
    "type",             // Unknown, so far all values 0
    "status",           // Unknown, so far all values 0
    "id",               // Unknown, so far all values = the player's number
    "aidifficulty",    
] as const;

export const RecordedGamePlayerMetadataBooleans = [
    "civwasrandom",     // Unknown if functional
    "civishidden",
    "ugccheck",         // Unknown; "ugc" = user generated content?
    "ready",            //
] as const;

export interface RecordedGamePlayerMetadata extends Record<typeof RecordedGamePlayerMetadataStrings[number], string>,
                                                    Record<typeof RecordedGamePlayerMetadataNumbers[number], number>,
                                                    Record<typeof RecordedGamePlayerMetadataBooleans[number], boolean>
{}

export const RecordedGameMetadataStrings = [
    "gamename",
    "gamemapname",                          // A lowercase string for the map name
    "gamefilename",                         // Unclear how (if at all) it differs from gamemapname
    "gamefilenameext",                      // For random, this becomes "standardmaps.set". This should make it possible to tell if the map was rolled randomly or chosen directly
    "gamepassword",     
    "custommapname",                        // Unknown
    "gamelastmapsetselected",               // Unknown
    "gamearenaseason",                      // Arena of the gods?
    "gamearenamission",
    "gameguid",
    "gamesessionguid",                      // Unclear how it's different to gameguid, could somehow be involved in restoring oos games?
    "gamemainmenuscenarioname",             // No idea why this is here
    "gamecontinuemainfilename",             // Unknown
    "gamecontinuecampaignfilename",         // Unknown
    "gamecontinuecampaignscenarioname",     // Unknown
    "gameregion",                           // Currently unused
    "gamelanguage",                         // Currently unused
    "gameplayfabpartyaddress",              // Unknown
] as const;

export const RecordedGameMetadataNumbers = [
    "gamemapsize",
    "gamemaptype",
    "gamenumplayers",                       // A lowercase string for the map name
    "gamecurplayers",                       // Unknown how it differs to gamenumplayers
    "gamefilecrc",                          // By storing a map of these values to something more meaningful (eg build numbers/dates) sorting by game versions may be doable
    "gametype",                             // Most likely an enum of supremacy/deathmatch/lightning etc, would need more recs to check other values
    "gamemodetype",                         // Unknown values, but could be important if it's different to gametype 
    "gamestartingresources",
    "gamemapresources",                     
    "gamestartingage",
    "gameendingage",
    "gamespeed",
    "gamemapvisibility",
    "gamehandicapmode",
    "gamerandomseed",                       // Possibly the seed used in the random map generator
    "gamedifficulty",                       // Likely global AI difficulty
    "mapsetfilter",
    "gamehosttime",                         // 0 in all beta recs I have looked at
    "gamelatency",                          // 0 in all beta recs I have looked at
    "gamenorush",                           // Treaty/no rush wasn't offered as a setting in the beta
    "gamearenaplayerchosendifficulty",      // Arena of the gods again?
    "gamecustommapfilecount",
    "mapmodid",
    "mapmodcrc",
    // I have no idea what any of these are, but they sound very campaign-like
    "gamempcoopcampaignid",
    "gamempcoopscenarioid",
    "gamecampaignselected",
    "gamecampaignprogress",
    "gamecampaignfarthest",
    "gamecampaignprogress1",
    "gamecampaignfarthest1",
    "gamecampaignprogress2",
    "gamecampaignfarthest2act1",
    "gamecampaignfarthest2act2",
    "gamecampaignfarthest2act3",
    "gamecontinuecampaignscenarionameid",
    "gamecontinuecampaignid",
    "gamecontinuecampaignscenarioid",
] as const;

export const RecordedGameMetadataBooleans = [
    "gameteamshareres",
    "gameteamsharepop",
    "gameteamlock",
    "gameteambalanced",
    "gameallowcheats",
    "gameconquest",
    "gameteamvictory",
    "gameonevsall",
    "gameallowtitans",
    "gameallowaiassist",
    "gamemilitaryautoqueue",
    "gamerestrictpause",
    "gamermdebug",                  // Most likely whether the game was run with random map debugging enabled
    "gamerestored",
    "gamefreeforall",               // How is this different to every player being on their own team?
    "gamerecordgame",               // The fact that this is a named variable inside a recorded game seems very confusing
    "gameblockade",                 // aoe3 holdover?
    "gamekoth",                     // King of the hill as a togglable option rather than specific map?
    "gameregicide",                 // King of the hill as a togglable option rather than specific map?
    "gamesuddendeath",
    "gamenomadstart",
    "gameaivsai",
    "gamestorymode",
    "gameismpscenario",
    "gameismpcoop",
    "gamemaprecommendedsettings",
    "usedenforcedagesettings",
] as const;

export interface RecordedGameMetadata extends Record<typeof RecordedGameMetadataStrings[number], string>,
                                              Record<typeof RecordedGameMetadataNumbers[number], number>,
                                              Record<typeof RecordedGameMetadataBooleans[number], boolean>
{
    // This array will INCLUDE MOTHER NATURE at index 0.
    playerdata: RecordedGamePlayerMetadata[];
    buildstring: string,
    buildnumber: number,
}

export const MajorGodsByIndex = new Map<number, string>([
    [0, "Nature"],
    [1, "Zeus"],
    [2, "Hades"],
    [3, "Poseidon"],
    [4, "Ra"],
    [5, "Isis"],
    [6, "Set"],
    [7, "Thor"],
    [8, "Odin"],
    [9, "Loki"],
    [10, "Kronos"],
    [11, "Oranos"],
    [12, "Gaia"],
]);

export class RecParseError extends Error
{
}
