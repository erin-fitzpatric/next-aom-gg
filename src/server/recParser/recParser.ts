"use server";
import { RecordedGameMetadata, RecordedGamePlayerMetadata, RecordedGameMetadataNumbersRequired, RecordedGameMetadataStringsRequired, RecordedGameMetadataBooleansRequired, RecordedGamePlayerMetadataBooleansRequired, RecordedGamePlayerMetadataNumbersRequired, RecordedGamePlayerMetadataStringsRequired, RecordedGamePlayerMetadataNumbersOptional, RecordedGameMetadataNumbersOptional, RecordedGamePlayerMetadataStringsOptional, RecordedGameMetadataStringsOptional, RecordedGamePlayerMetadataBooleansOptional, RecordedGameMetadataBooleansOptional, RecordedGameRawKeysToCamelCase } from "@/types/recParser/RecordedGameParser";
import { Errors } from "@/utils/errors";
import { promisify } from "util";
import { CompressCallback, inflate, InputType } from "zlib";
import { formatRecordedGameHierarchy, parseRecordedGameHierarchy, traverseRecordedGameHierarchy } from "./hierarchy";
import { RecordedGameHierarchyContainer } from "@/types/recParser/Hierarchy";
import { readRecordedGameString } from "./common";
import { getRecXMBStrict, parseRecXMBList } from "./xmb";
import { RecordedGameXMBData } from "@/types/recParser/Xmb";
import { parseRecordedGameCommandList } from "./gameCommands";
import { RecordedGameRefinedCommands, RefinedGameCommand } from "@/types/recParser/GameCommands";

const REC_PARSER_STRUCTURE_VERSION = 2;

// The max allowed decompressed size of files that are passed as "recorded games".
// This needs to be limited to avoid someone uploading a huge zlib decompression bomb and trying to decompress the entire thing in memory
const RECORDED_GAME_MAX_BYTES_TO_DECOMPRESS = 500000000; // 50mb


const inflatePromisify = promisify((buf: InputType, callback: CompressCallback) => { inflate(buf, {maxOutputLength: RECORDED_GAME_MAX_BYTES_TO_DECOMPRESS}, callback)});

export async function parseRecordedGameMetadata(file: File): Promise<RecordedGameMetadata>
{
    console.log(`Starting reading recorded game: ${file.name}`);
    const decompressed = await decompressL33tZlib(await file.arrayBuffer());
    return await parseMetadataFromDecompressedRecordedGame(decompressed);
}


// This "l33t-zlib" format was used in the original AoM (and probably AoE3 as well)
// This means that passing non-retold recorded games (and some other formats, like .scx scenarios) WILL decompress correctly
async function decompressL33tZlib(compressed: ArrayBuffer): Promise<Buffer>
{
    //console.log("Starting decompress...");
    const utf8Decoder = new TextDecoder("utf-8");
    const leet = utf8Decoder.decode(compressed.slice(0, 4));
    if (leet != "l33t")
    {
        throw new Error(Errors.FILE_IS_NOT_A_RECORDED_GAME, {cause:"Not a valid Age of Mythology file"});
    }
    // Next four bytes contain the length of the decompressed data, but we don't really care about that
    try
    {
        const decompressed = await inflatePromisify(compressed.slice(8));
        return decompressed;
    }
    catch (err)
    {
        throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause:"Failed to decompress file: " + err});
    }
}

function encodeUtf16(str: string)
{
    const buffer = new ArrayBuffer(2*str.length);
    const view = new DataView(buffer);
    for (let i=0; i<str.length; i++)
    {
        view.setUint16(i*2, str.charCodeAt(i), true);
    }
    return new Uint8Array(buffer);
}

async function parseMetadataFromDecompressedRecordedGame(decompressed: Buffer): Promise<RecordedGameMetadata>
{
    const root = parseRecordedGameHierarchy(decompressed);
    const buildInfoData = traverseRecordedGameHierarchy(root, ["FH"], "data", 1)[0];
    const buildInfoString = readRecordedGameString(buildInfoData.data, 0).content;
    // eg "AoMRT_s.exe 452295 //stream/Athens/beta"
    const splitInfoString = buildInfoString.split(" ");
    if (splitInfoString.length != 3)
    {
        throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause:`Build info string ${splitInfoString} did not split into three components`});
    }
    const buildNumber = parseInt(splitInfoString[1]);
    if (isNaN(buildNumber))
    {
        throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause:`Failed to parse build number from info string ${splitInfoString}`});
    }
    const output = {
        // 13 total: 12 players plus mother nature
        playerData: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
        buildString: buildInfoString,
        buildNumber: buildNumber,
        parsedAt: new Date(),
    };
    // Benchmark recs contain a .mythscn path with the word "benchmark" in FH
    const couldBeBenchmark = buildInfoData.data.indexOf(encodeUtf16("benchmark")) >= 0;
    parseProfileKeys(root, couldBeBenchmark, output);
    const typedOutput = output as RecordedGameMetadata;

    // Now that base data is loaded, trim output.playerdata to the correct number of players
    typedOutput.playerData.splice(typedOutput.gameNumPlayers+1, 13-typedOutput.gameNumPlayers);

    // Reject any games with AI players
    if (typedOutput.playerData.some((player) => { return player.aiPersonality !== undefined && player.aiPersonality.length > 0}))
    {
        if (!process.env.RECPARSER_ACCEPT_AIS)
            throw new Error(Errors.GAME_HAS_AI_PLAYERS);
    }
    
    if (!process.env.RECPARSER_ACCEPT_TGS && typedOutput.gameNumPlayers > 2)
        throw new Error(Errors.UNSUPPORTED_GAME_SIZE, {cause:`Currently uploads are limited to 1v1s only - this game has ${typedOutput.gameNumPlayers} players!`});
    
    // Resolves random teams into their real numbers
    // and anything else that needs deriving from the player data sections
    parsePlayerDataSections(typedOutput, root);
    const xmbData = parseRecXMBList(root);

    parseMajorGodsToNames(typedOutput, xmbData);

    const commandData = parseRecordedGameCommandList(root, decompressed);
    if (commandData.success)
    {
        parseCommandDerivedValues(typedOutput, commandData, xmbData);
        typedOutput.commandParserWarnings = commandData.warnings;
        typedOutput.commandParserGeneratedWarnings = (commandData.warnings ?? []).length > 0;
        typedOutput.commands = commandData;
    }
    else
    {
        typedOutput.commandParserError = commandData.error;
    }

    //console.log(formatRecordedGameHierarchy(root));

    typedOutput.version = REC_PARSER_STRUCTURE_VERSION;
    const view = new DataView(decompressed.buffer);
    // The end of the file is the command list, with one entry per 20th of a second
    // 5 bytes before the end of the file is the index of the last one
    // If the actual command list fails to parse for any reason, this should still be able to get the game duration successfully
    const numGameEntriesOffset = decompressed.length - 5;
    const numGameEntries = view.getUint32(numGameEntriesOffset, true);
    typedOutput.gameLength = numGameEntries / 20;
    return typedOutput;
}

function parseProfileKeys(root: RecordedGameHierarchyContainer, couldBeBenchmark: boolean, output: any)
{
    const profileKeysMatches = traverseRecordedGameHierarchy(root, ["MP", "ST"], "data");
    if (profileKeysMatches.length != 1)
    {
        if (couldBeBenchmark)
        {
            throw new Error(Errors.GAME_IS_BENCHMARK, {cause:"This looks like a recorded game of the benchmark - it is not a multiplayer game!"});
        }
        // throw new Error(Errors.NOT_A_MULTIPLAYER_GAME, {cause:"Could not find metadata - ensure this is a multiplayer Retold recorded game"});
    }
    const profileKeys = profileKeysMatches[0];
    // This is a table of mapped key names to values.
    // The key names are some subset of what can be found in user profiles (eg /Users/username/Games/Age of Mythology Retold/steamid/users/UserProfile.xml)
    // which is why I named this "proflle keys".

    // The table itself is simply:
    // 0) uint32: unknown, potentially always zero
    // 1) uint32: number of keys
    // For each key:
    //  1) string (see readString) containing the key's name
    //  2) uint32: key data type
    //  3) variable: key's value

    const view = new DataView(profileKeys.data.buffer, profileKeys.data.byteOffset);
    const keyCountOffset = 4; // skip unknown uint32
    //console.log(`Reading key count at offset ${keyCountOffset+profileKeys.offset}`);
    const keyCount = view.getUint32(keyCountOffset, true);
    // Actual number of keys in beta recorded games = 383
    if (keyCount < 50 || keyCount > 1000)
    {
        throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause:`Bad metadata key count: ${keyCount} at ${keyCountOffset}`});
    }
    
    // Points to the length of the string of the first key
    let currentOffset = keyCountOffset + 4;
    let foundKeyType3 = false;
    for (let keyIndex=0; keyIndex<keyCount; keyIndex++)
    {
        if (foundKeyType3)
        {
            throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause: `Profile key index ${keyIndex} found after a type 3, cannot continue due to unknown data length`});
        }
        const keyData = readRecordedGameString(profileKeys.data, currentOffset);
        const key = keyData.content;
        currentOffset += keyData.streamBytesConsumed;
        const keyType = view.getUint32(currentOffset, true);
        currentOffset += 4;
        // keyType is an enum, but all the values aren't known
        switch (keyType)
        {
            case 1:     // 4 bytes, used for player rating but is different to 2, assuming uint32 (but all current values are 0)
            case 2:     // Definitely int32
            case 4:     // 2 bytes, only known values are 0, assuming int16
            {
                let keyValue = 0;
                if (keyType == 4)
                {
                    keyValue = view.getInt16(currentOffset, true);
                    currentOffset += 2;
                }
                else
                {
                    if (keyType == 1)
                        keyValue = view.getUint32(currentOffset, true);
                    else
                        keyValue = view.getInt32(currentOffset, true);
                    currentOffset += 4;
                }
                addMetadataKeyToOutput(output, key, keyValue);
                break;
            }
            case 6:     // bool
            {
                const keyValue = view.getUint8(currentOffset) != 0;
                currentOffset += 1;
                addMetadataKeyToOutput(output, key, keyValue);
                break;
            }
            case 10:    // string
            {
                const keyValueData = readRecordedGameString(profileKeys.data, currentOffset);
                const keyValue = keyValueData.content;
                currentOffset += keyValueData.streamBytesConsumed;
                addMetadataKeyToOutput(output, key, keyValue);
                break;
            }
            case 3:
            {
                // Only gamesyncstate uses this, and I have no idea what its value is
                // or its length, because it's at the end of the list
                // Because of that, the safest thing to do is to throw an error if there's ever a key after it
                foundKeyType3 = true;
                break;
            }
            default:
                throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause:`Profile key ${key} has unknown type ${keyType}`});
        }
    }
    const typedOutput = output as RecordedGameMetadata;

    // Make sure all the keys are there that should be there
    let playerDataKeys = RecordedGamePlayerMetadataNumbersRequired as ReadonlyArray<string>;
    playerDataKeys = playerDataKeys.concat(RecordedGamePlayerMetadataStringsRequired as ReadonlyArray<string>);
    playerDataKeys = playerDataKeys.concat(RecordedGamePlayerMetadataBooleansRequired as ReadonlyArray<string>);
    for (const playerIndex in typedOutput.playerData)
    {
        const playerData = typedOutput.playerData[playerIndex];
        for (const key of playerDataKeys)
        {
            if (playerData[key as keyof RecordedGamePlayerMetadata] === undefined)
            {
                throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause:`Player ${playerIndex} metadata missing required key ${key}`});
            }
        }
    }
    let mainDataKeys = RecordedGameMetadataNumbersRequired as ReadonlyArray<string>;
    mainDataKeys = mainDataKeys.concat(RecordedGameMetadataStringsRequired as ReadonlyArray<string>);
    mainDataKeys = mainDataKeys.concat(RecordedGameMetadataBooleansRequired as ReadonlyArray<string>);
    for (const key of mainDataKeys)
    {
        if (typedOutput[key as keyof RecordedGameMetadata] === undefined)
        {
            throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause:`Recorded game metadata missing required key ${key}`});
        }
    }
}

function fixMetadataKey(keyName: string)
{
    // I think a developer made a typo... but only on player 4!?
    if (keyName == "cgameplayer4aidifficulty")
    {
        keyName = "gameplayer4aidifficulty";
    }
    return keyName;
}

function addMetadataKeyToOutput(output: any, keyName: string, value: number | string | boolean): void
{
    keyName = fixMetadataKey(keyName);
    const isPlayerKey = keyName.startsWith("gameplayer");
    let targetObject = output;
    if (isPlayerKey)
    {
        let playerNumber = parseInt(keyName.slice(10, 12));
        if (isNaN(playerNumber))
        {
            throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause:`Failed to parse player number from metadata key ${keyName} with value ${value}`});
        }
        const playerNumberLength = playerNumber.toFixed(0).length;
        keyName = keyName.slice(10 + playerNumberLength);
        targetObject = output.playerData[playerNumber];
    }
    keyName = RecordedGameRawKeysToCamelCase.get(keyName) ?? keyName;
    let requiredKeys: ReadonlyArray<String> = [];
    let optionalKeys: ReadonlyArray<String> = [];
    let isValidKey = false;
    if (typeof value == "number")
    {
        requiredKeys = isPlayerKey ? RecordedGamePlayerMetadataNumbersRequired : RecordedGameMetadataNumbersRequired as ReadonlyArray<string>;
        optionalKeys = isPlayerKey ? RecordedGamePlayerMetadataNumbersOptional : RecordedGameMetadataNumbersOptional as ReadonlyArray<string>;
    }
    else if (typeof value == "string")
    {
        requiredKeys = isPlayerKey ? RecordedGamePlayerMetadataStringsRequired : RecordedGameMetadataStringsRequired as ReadonlyArray<string>;
        optionalKeys = isPlayerKey ? RecordedGamePlayerMetadataStringsOptional : RecordedGameMetadataStringsOptional as ReadonlyArray<string>;
    }
    else if (typeof value == "boolean")
    {
        requiredKeys = isPlayerKey ? RecordedGamePlayerMetadataBooleansRequired : RecordedGameMetadataBooleansRequired as ReadonlyArray<string>;
        optionalKeys = isPlayerKey ? RecordedGamePlayerMetadataBooleansOptional : RecordedGameMetadataBooleansOptional as ReadonlyArray<string>;
    }
    isValidKey = requiredKeys.includes(keyName) || optionalKeys.includes(keyName);
    if (!isValidKey)
    {
        // console.log(`Discarded key ${keyName} value ${value}`);
        return;
    }
    targetObject[keyName] = value;
}


function parsePlayerDataSections(output: RecordedGameMetadata, hierarchy: RecordedGameHierarchyContainer)
{
    // Profile keys has teamid = -1 for random teams, which is no good
    // This gets the real team ids out of the binary player data section instead
    const playerSections = traverseRecordedGameHierarchy(hierarchy, ["J1", "PL", "BP", "P1"], "data");
    if (playerSections.length < 2)
        throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause: `Failed to find enough player data sections: only found ${playerSections.length}`});
    // Each player gets two dummy P1 sections (containing only 4b data) after the one with the actual content in.
    // I suppose it might be nice to know why, but alas.
    let playerNumber = 0;
    for (const section of playerSections)
    {
        // Skip dummy sections with nothing of value in
        if (section.data.length < 5)
            continue;
        // Mother nature is different due to having a string ID embedded
        // Don't need it anyway.
        if (playerNumber > 0)
        {
            // These contain:
                // int32: player number
                // byte: 0?
                // String: the name once
                // bytes[9]: nulls
                // String: the name a second time
                // int32: team id
            const view = new DataView(section.data.buffer, section.data.byteOffset);
            const readPlayerNumber = view.getInt32(0, true);
            if (playerNumber != readPlayerNumber)
                throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause: `Parsing teams for section at ${section.data.byteOffset}: expected to find player number ${playerNumber}, found ${readPlayerNumber}`});
            const nameOne = readRecordedGameString(view, 5);
            const nameTwo = readRecordedGameString(view, 5 + nameOne.streamBytesConsumed + 9);
            if (nameOne.content != nameTwo.content)
                throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause: `Parsing teams for section at ${section.data.byteOffset}: player ${playerNumber}'s names aren't identical: ${nameOne.content} vs ${nameTwo.content}`});
            const teamIdOffset = 5 + nameOne.streamBytesConsumed + 9 + nameTwo.streamBytesConsumed;
            const teamId = view.getInt32(teamIdOffset, true);
            if (teamId > 12)
                throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause: `Parsing teams for section at ${section.data.byteOffset}: read invalid team ID ${teamId} at ${teamIdOffset} for ${nameOne.content}`});
            output.playerData[playerNumber].teamId = teamId;
            // For AI players: the profile keys simply names them "Player 2" etc, in this section we just got their "real" name instead
            // So using that instead
            if (output.playerData[playerNumber].aiPersonality)
            {
                output.playerData[playerNumber].name = nameOne.content + " (AI)";
            }
        }
        playerNumber++;
    }

    output.teams = [];
    const teamIdToTeamArrayIndex = new Map<number, number>();
    
    for (const playerData of output.playerData)
    {
        // Mother nature doesn't belong to a team
        if (playerData.id == 0) continue;
        const teamId = playerData.teamId;
        let index = teamIdToTeamArrayIndex.get(teamId);
        if (index === undefined)
        {
            index = output.teams.length;
            teamIdToTeamArrayIndex.set(teamId, index);
            output.teams.push([playerData.id]);
        }
        else
        {
            output.teams[index].push(playerData.id);
        }
    }

    if (output.teams.length < 2)
    {
        throw new Error(Errors.UNSUPPORTED_GAME_SIZE, {cause: `The players in this game seem to only be arranged into ${output.teams.length} teams(s).`});
    }
    
    output.teamsFormatString = output.teams.map((teamArray) => teamArray.length).join("v");
}

function parseMajorGodsToNames(typedOutput: RecordedGameMetadata, xmbData: RecordedGameXMBData)
{
    const civs = getRecXMBStrict(xmbData, "civs");
    const enumMapping: Record<number, string> = {0: "Nature"};
    let thisId = 1;
    for (const child of civs.children)
    {
        if (child.name == "civ")
        {
            const name = child.children.filter((child) => (child.name == "name"))[0].value;
            enumMapping[thisId] = name;
            thisId++;
        }
    }
    for (const playerData of typedOutput.playerData)
    {
        const fetched = enumMapping[playerData.civ];
        if (fetched === undefined)
            throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause: `Player ${playerData.id}'s civ ${playerData.civ} was not in the packed XMB data`});
        playerData.civName = fetched;
    }
}

const ageNames = ["ClassicalAge", "HeroicAge", "MythicAge"];

function parseCommandDerivedValues(typedOutput: RecordedGameMetadata, commandData: RecordedGameRefinedCommands, xmbData: RecordedGameXMBData)
{
    if (commandData.commandsByPlayer)
    {
        const resignedPlayers: number[] = [];
        const techtree = getRecXMBStrict(xmbData, "techtree");
        //console.log(JSON.stringify(techtree, undefined, 2));
        const ageUpTechs: Map<string, string> = new Map();
        for (const tech of techtree.children)
        {
            const isAgeUpgrade = tech.children.some((child) => child.name == "flag" && child.value == "AgeUpgrade");
            if (isAgeUpgrade)
            {
                const flags = tech.children.filter((child) => child.name = "techtype")
                //console.log(`Possible age upgrade ${tech.attribs['name']} has ${flags.length} techtypes`)
                for (const flag of flags)
                {
                    if (ageNames.indexOf(flag.value) > -1)
                    {
                        ageUpTechs.set(tech.attribs["name"], flag.value);
                        //console.log(`ageUpTechs[${tech.attribs["name"]}] = ${flag.value}`);
                    }
                }
            }
        }
        
        for (const playerIdString of Object.keys(commandData.commandsByPlayer))
        {
            const playerIdNumber = Number(playerIdString);
            const playerCommands: RefinedGameCommand[] = commandData.commandsByPlayer[playerIdString as any];
            typedOutput.playerData[playerIdNumber].techTimes = {};
            let numActions = 0;
            for (const playerCommand of playerCommands)
            {
                if (playerCommand.countsForCPM)
                    numActions++;
                if (playerCommand.commandType == "resign")
                {
                    if (resignedPlayers.indexOf(playerCommand.resigningPlayer) < 0)
                        resignedPlayers.push(playerCommand.resigningPlayer);
                }
                else if (playerCommand.commandType == "research" || playerCommand.commandType == "prequeueTech")
                {
                    if (playerCommand.tech < techtree.children.length)
                    {
                        const techName = techtree.children[playerCommand.tech].attribs["name"];

                        typedOutput.playerData[playerIdNumber].techTimes[techName] = playerCommand.gameTime;
                        const ageUpTech = ageUpTechs.get(techName);
                        if (ageUpTech)
                        {
                            //console.log(`Potential age up tech ${techName} -> ${ageUpTech}`);
                            let godName = techName;
                            if (godName.startsWith(ageUpTech))
                            {
                                godName = godName.slice(ageUpTech.length);
                            }
                            if (ageUpTech == "ClassicalAge")
                                typedOutput.playerData[playerIdNumber].classicalAgeMinorGod = godName;
                            else if (ageUpTech == "HeroicAge")
                                typedOutput.playerData[playerIdNumber].heroicAgeMinorGod = godName;
                            else if (ageUpTech == "MythicAge")
                                typedOutput.playerData[playerIdNumber].mythicAgeMinorGod = godName;
                        }
                    }
                    else
                    {
                        commandData.warnings?.push(`parseCommandDerivedValues: ${playerIdNumber} tried to research ${playerCommand.tech} at ${playerCommand.gameTime} which isn't in the techtree`);
                    }
                }
            }
            const activeTimeMinutes = Math.max(1.0, (playerCommands[playerCommands.length - 1].gameTime)/60);
            typedOutput.playerData[playerIdNumber].approximateCommandsPerMinute = numActions/activeTimeMinutes;
        }
        typedOutput.unresignedPlayers = [];
        for (const playerData of typedOutput.playerData)
        {
            if (playerData.id > 0 && resignedPlayers.indexOf(playerData.id) == -1)
            {
                typedOutput.unresignedPlayers.push(playerData.id);
            }
        }
    }
}