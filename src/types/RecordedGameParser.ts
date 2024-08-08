// Types related to the parser and RecordedGameMetadata

// For consistency, parse keys to camelCase versions
// Anything not in this list will be unchanged
// This could also be used to arbitrarily change the name something is saved as...
export const RecordedGameRawKeysToCamelCase = new Map<string, string>([
    // Player data keys
    ["civlist", "civList"],
    ["winratio", "winRatio"],
    ["powerrating", "powerRating"],
    ["pfentity", "pfEntity"],
    ["aipersonality", "aiPersonality"],
    ["avatarid", "avatarId"],
    ["teamid", "teamId"],
    ["aidifficulty", "aiDifficulty"],
    ["civwasrandom", "civWasRandom"],   
    ["civishidden", "civIsHidden"],   
    ["aotgblessings", "aotgBlessings"],
    ["ugccheck", "ugcCheck"],
    // Main data keys
    ["gamemapname", "gameMapName"],
    ["gamefilename", "gameFileName"],
    ["gamefilenameext", "gameFileNameExt"],
    ["gameguid", "gameGuid"],
    ["gamesessionguid", "gameSessionGuid"],
    ["gamename", "gameName"],
    ["gamepassword", "gamePassword"],
    ["gamelanguage", "gameLanguage"],
    ["gameregion", "gameRegion"],
    ["custommapname", "customMapName"],
    ["gamelastmapsetselected", "gameLastMapSetSelected"],
    ["gamearenasession", "gameArenaSession"],
    ["gamearenamission", "gameArenaMission"],
    ["gameplayfabpartyaddress", "gamePlayFabPartyAddress"], // don't know what this is, may be capitalised incorrectly
    ["gamemainmenuscenarioname", "gameMainMenuScenarioName"],
    ["gamecontinuemainfilename", "gameContinueMainFileName"],
    ["gamecontinuecampaignfilename", "gameContinueCampaignFileName"],
    ["gamecontinuecampaignscenarioname", "gameContinueCampaignScenarioName"],
    ["gamemapsize", "gameMapSize"],
    ["gamemaptype", "gameMapType"],
    ["gamenumplayers", "gameNumPlayers"],
    ["gamecurplayers", "gameCurPlayers"],
    ["gamefilecrc", "gameFileCrc"],
    ["gametype", "gameType"],
    ["gamemodetype", "gameModeType"],
    ["gamestartingresources", "gameStartingResources"],
    ["gamemapresources", "gameMapResources"],
    ["gamestartingage", "gameStartingAge"],
    ["gameendingage", "gameEndingAge"],
    ["gamespeed", "gameSpeed"],
    ["gamemapvisibility", "gameMapVisibility"],
    ["gamehandicapmode", "gameHandicapMode"],
    ["gamerandomseed", "gameRandomSeed"],
    ["gamedifficulty", "gameDifficulty"],
    ["mapsetfilter", "mapSetFilter"],
    ["gamehosttime", "gameHostTime"],
    ["gamelatency", "gameLatency"],
    ["gamenorush", "gameNoRush"],
    ["gamearenaplayerchosendifficulty", "gameArenaPlayerChosenDifficulty"],
    ["gamecustommapfilecount", "gameCustomMapFileCount"],
    ["mapmodid", "mapModId"],
    ["mapmodcrc", "mapModCrc"],
    ["gamempcoopcampaignid", "gameMpCoopCampaignId"],
    ["gamempcoopscenarioid", "gameMpCoopScenarioId"],
    ["gamecampaignselected", "gameCampaignSelected"],
    ["gamecampaignprogress", "gameCampaignProgress"],
    ["gamecampaignfarthest", "gameCampaignFarthest"],
    ["gamecampaignprogress1", "gameCampaignProgress1"],
    ["gamecampaignfarthest1", "gameCampaignFarthest1"],
    ["gamecampaignprogress2", "gameCampaignProgress2"],
    ["gamecampaignfarthest2act1", "gameCampaignFarthest2Act1"],
    ["gamecampaignfarthest2act2", "gameCampaignFarthest2Act2"],
    ["gamecampaignfarthest2act3", "gameCampaignFarthest2Act3"],
    ["gamecontinuecampaignscenarionameid", "gameContinueCampaignScenarioNameId"],
    ["gamecontinuecampaignid", "gameContinueCampaignId"],
    ["gamecontinuecampaignscenarioid", "gameContinueCampaignScenarioId"],
    ["gameteamshareres", "gameTeamShareRes"],
    ["gameteamsharepop", "gameTeamSharePop"],
    ["gameteamlock", "gameTeamLock"],
    ["gameteambalanced", "gameTeamBalanced"],
    ["gameallowcheats", "gameAllowCheats"],
    ["gameconquest", "gameConquest"],
    ["gameteamvictory", "gameTeamVictory"],
    ["gameonevsall", "gameOneVsAll"],
    ["gameallowtitans", "gameAllowTitans"],
    ["gameallowaiassist", "gameAllowAiAssist"],
    ["gamemilitaryautoqueue", "gameMilitaryAutoqueue"],
    ["gamerestrictpause", "gameRestrictPause"],
    ["gamermdebug", "gameRmDebug"],
    ["gamerestored", "gameRestored"],
    ["gamefreeforall", "gameFreeForAll"],
    ["gamerecordgame", "gameRecordGame"],
    ["gameblockade", "gameBlockade"],
    ["gamekoth", "gameKoth"],
    ["gameregicide", "gameRegicide"],
    ["gamesuddendeath", "gameSuddenDeath"],
    ["gamenomadstart", "gameNomadStart"],
    ["gameaivsai", "gameAiVsAi"],
    ["gamestorymode", "gameStoryMode"],
    ["gameismpscenario", "gameIsMpScenario"],
    ["gameismpcoop", "gameIsMpCoop"],
    ["gamemaprecommendedsettings", "gameMapRecommendedSettings"],
    ["gamearenaseason", "gameArenaSeason"],
    ["usedenforcedagesettings", "usedEnforcedAgeSettings"]
]);

// These arrays define the type and required/optional-ness of the final interfaces
// Anything required but missing will throw an error at parse time
// Any keys present in the recorded game file but not in any of these will get discarded
// Due to Mongo not saving "", any strings that can be "" need to be passed as optional

// For completeness, everything that is a valid key but unwanted is getting commented out (rather than just deleted)

export const RecordedGamePlayerMetadataStringsRequired = [
    "name", 
    "civList",          // Unknown format, most likely somehow contains which random god(s) the player selected  
] as const;

export const RecordedGamePlayerMetadataStringsOptional = [
    "clan",             // Unused in beta
    "rank",             // Unused
    "winRatio",         // Unused
    "powerRating",      // Unused
    "aotgBlessings",    // Unknown, "aotg" is probably arena of the gods - can't tell from beta alone
    "pfEntity",         // Unknown
    "aiPersonality",
    "avatarId",     
] as const;

export const RecordedGamePlayerMetadataNumbersRequired = [
    "teamId", 
    "civ",
    "rating",           // 0 in beta
    "color",         
    "handicap",                
    "type",             // Unknown, so far all values 0
    "status",           // Unknown, so far all values 0
    "id",               // Unknown, so far all values = the player's number
    //"aiDifficulty",    
] as const;

export const RecordedGamePlayerMetadataNumbersOptional = [ 
] as const;

export const RecordedGamePlayerMetadataBooleansRequired = [
    "civWasRandom",     // Unknown if functional
    "civIsHidden",
    "ugcCheck",         // Unknown; "ugc" = user generated content?
    //"ready",
] as const;

export const RecordedGamePlayerMetadataBooleansOptional = [
] as const;

export interface RecordedGamePlayerMetadata extends Record<typeof RecordedGamePlayerMetadataStringsRequired[number], string>,
                                                    Record<typeof RecordedGamePlayerMetadataNumbersRequired[number], number>,
                                                    Record<typeof RecordedGamePlayerMetadataBooleansRequired[number], boolean>,
                                                    Partial<Record<typeof RecordedGamePlayerMetadataStringsOptional[number], string>>,
                                                    Partial<Record<typeof RecordedGamePlayerMetadataNumbersOptional[number], number>>,
                                                    Partial<Record<typeof RecordedGamePlayerMetadataBooleansOptional[number], boolean>>
{}

export const RecordedGameMetadataStringsRequired = [
    "gameMapName",                          // A lowercase string for the map name
    "gameFileName",                         // Unclear how (if at all) it differs from gamemapname
    "gameFileNameExt",                      // For random, this becomes "standardmaps.set". This should make it possible to tell if the map was rolled randomly or chosen directly
    "gameGuid",
    "gameSessionGuid",                      // Unclear how it's different to gameguid, could somehow be involved in restoring oos games?
] as const;

export const RecordedGameMetadataStringsOptional = [
    // Unsure if useful
    //"gameName",
    //"gamePassword",     
    //"gameLanguage",                         // Currently unused
    //"gameRegion",                           // Currently unused
    // Unknown, unsure if useful
    "customMapName",                        // Unknown
    //"gameLastMapSetSelected",               // Unknown
    //"gameArenaSeason",                      // Arena of the gods?
    //"gameArenaMission",
    "gamePlayFabPartyAddress",              // Unknown
    //"gameMainMenuScenarioName",             // No idea why this is here
    //"gameContinueMainFileName",             // Unknown
    //"gameContinueCampaignFileName",         // Unknown
    //"gameContinueCampaignScenarioName",     // Unknown
] as const;

export const RecordedGameMetadataNumbersRequired = [
    "gameMapSize",
    "gameMapType",
    "gameNumPlayers",                       // A lowercase string for the map name
    "gameCurPlayers",                       // Unknown how it differs to gamenumplayers
    "gameFileCrc",                          // By storing a map of these values to something more meaningful (eg build numbers/dates) sorting by game versions may be doable
    "gameType",                             // Most likely an enum of supremacy/deathmatch/lightning etc, would need more recs to check other values
    "gameModeType",                         // Unknown values, but could be important if it's different to gametype 
    "gameStartingResources",
    "gameMapResources",                     
    "gameStartingAge",
    "gameEndingAge",
    "gameSpeed",
    "gameMapVisibility",
    "gameHandicapMode",
    //"gameRandomSeed",                       // Possibly the seed used in the random map generator
    //"gameDifficulty",                       // Likely global AI difficulty
    "mapSetFilter",
    "gameHostTime",                         // 0 in all beta recs I have looked at
    "gameLatency",                          // 0 in all beta recs I have looked at
    "gameNoRush",                           // Treaty/no rush wasn't offered as a setting in the beta
    "gameArenaPlayerChosenDifficulty",      // Arena of the gods again?
    //"gameCustomMapFileCount",
    "mapModId",
    "mapModCrc",
    // I have no idea what any of these are, but they sound very campaign-like
    // Probably can be removed from here
    //"gameMpCoopCampaignId",
    //"gameMpCoopScenarioId",
    //"gameCampaignSelected",
    //"gameCampaignProgress",
    //"gameCampaignFarthest",
    //"gameCampaignProgress1",
    //"gameCampaignFarthest1",
    //"gameCampaignProgress2",
    //"gameCampaignFarthest2Act1",
    //"gameCampaignFarthest2Act2",
    //"gameCampaignFarthest2Act3",
    //"gameContinueCampaignScenarioNameId",
    //"gameContinueCampaignId",
    //"gameContinueCampaignScenarioId",
] as const;

export const RecordedGameMetadataNumbersOptional = [] as const;

export const RecordedGameMetadataBooleansRequired = [
    "gameTeamShareRes",
    "gameTeamSharePop",
    "gameTeamLock",
    "gameTeamBalanced",
    "gameAllowCheats",
    "gameConquest",
    "gameTeamVictory",
    "gameOneVsAll",
    "gameAllowTitans",
    "gameAllowAiAssist",
    "gameMilitaryAutoqueue",
    "gameRestrictPause",
    //"gameRmDebug",                  // Most likely whether the game was run with random map debugging enabled
    "gameRestored",
    "gameFreeForAll",               // How is this different to every player being on their own team?
    //"gameRecordGame",               // The fact that this is a named variable inside a recorded game seems very confusing
    "gameBlockade",                 // aoe3 holdover?
    "gameKoth",                     // King of the hill as a togglable option rather than specific map?
    "gameRegicide",                 // Regicide as a togglable option rather than specific map?
    "gameSuddenDeath",
    "gameNomadStart",
    //"gameAiVsAi",
    //"gameStoryMode",
    "gameIsMpScenario",
    "gameIsMpCoop",
    "gameMapRecommendedSettings",
    "usedEnforcedAgeSettings",
] as const;

export const RecordedGameMetadataBooleansOptional = [] as const;

export interface RecordedGameMetadata extends Record<typeof RecordedGameMetadataStringsRequired[number], string>,
                                              Record<typeof RecordedGameMetadataNumbersRequired[number], number>,
                                              Record<typeof RecordedGameMetadataBooleansRequired[number], boolean>,
                                              Partial<Record<typeof RecordedGameMetadataStringsOptional[number], string>>,
                                              Partial<Record<typeof RecordedGameMetadataNumbersOptional[number], number>>,
                                              Partial<Record<typeof RecordedGameMetadataBooleansOptional[number], boolean>>
{
    /**
     * This array will contain an entry for player 0 (mother nature) at index 0.
     */
    playerData: RecordedGamePlayerMetadata[];
    /**
     * The raw build info string from the recorded game, eg "AoMRT_s.exe 452295 //stream/Athens/beta"
     */
    buildString: string,
    /**
     * The game build number from the build info string
     */
    buildNumber: number,
    parsedAt: Date,
    /**
     * Contains 1 entry per team. Each entry contains the player numbers of players on that team.
     * Eg: a 3v3 with p1/2/3 vs p4/5/6 = [[1, 2, 3], [4, 5, 6]]
     */
    teams: number[][],
    /**
     *  A string that lists the sizes of all the teams in the game. 
     *  Eg: "1v1", "3v3", "1v2v3"...
     */
    teamsFormatString?: string,
}