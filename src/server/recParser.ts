"use server";
import { RecordedGameMetadata, RecordedGamePlayerMetadata, RecordedGameMetadataNumbersRequired, RecordedGameMetadataStringsRequired, RecordedGameMetadataBooleansRequired, RecordedGamePlayerMetadataBooleansRequired, RecordedGamePlayerMetadataNumbersRequired, RecordedGamePlayerMetadataStringsRequired, RecordedGamePlayerMetadataNumbersOptional, RecordedGameMetadataNumbersOptional, RecordedGamePlayerMetadataStringsOptional, RecordedGameMetadataStringsOptional, RecordedGamePlayerMetadataBooleansOptional, RecordedGameMetadataBooleansOptional, RecordedGameRawKeysToCamelCase } from "@/types/RecordedGameParser";
import { Errors } from "@/utils/errors";
import { promisify } from "util";
import { CompressCallback, inflate, InputType } from "zlib";

const REC_PARSER_STRUCTURE_VERSION = 1;

// The max allowed decomprssed size of files that are passed as "recorded games".
// This needs to be limited to avoid someone uploading a huge zlib decompression bomb and trying to decompress the entire thing in memory
const RECORDED_GAME_MAX_BYTES_TO_DECOMPRESS = 500000000; // 50mb
// Refuse to try to read strings longer than this, as it's indicative that something went wrong
const RECORDED_GAME_MAX_STRING_LENGTH = 500;

const inflatePromisify = promisify((buf: InputType, callback: CompressCallback) => { inflate(buf, {maxOutputLength: RECORDED_GAME_MAX_BYTES_TO_DECOMPRESS}, callback)});

export async function parseRecordedGameMetadata(file: File): Promise<RecordedGameMetadata>
{
    console.log("Starting reading recorded game...");
    const decompressed = await decompressL33tZlib(await file.arrayBuffer());
    return await parseMetadataFromDecompressedRecordedGame(decompressed);
}

interface ParsedString
{
    content: string,
    unsafeContent: string,
    streamBytesConsumed: number,
};

// In these files, a string is saved as:
// 1) The number of characters in the string, as a little endian int32
// 2) Bytes of the number of characters in the string, encoded as utf16
// (This means 2 bytes of buffer per character in the string)
function readString(buffer: ArrayBuffer, offset: number): ParsedString
{
    const view = new DataView(buffer);
    const stringLength = view.getUint32(offset, true);
    if (stringLength > RECORDED_GAME_MAX_STRING_LENGTH)
    {
        throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause:`Attempted to read string at ${offset} with illegal length ${stringLength}`});
    }
    const characterDataSlice = buffer.slice(offset+4, offset+4 + (2*stringLength));
    const uint8CharacterData = new Uint8Array(characterDataSlice);
    const decoder = new TextDecoder("utf-16le");
    const unsafeContent = decoder.decode(uint8CharacterData);
    const streamBytesConsumed = 4 + (unsafeContent.length*2);
    const saferContent = unsafeContent.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039");

    return {
        content: saferContent,
        unsafeContent: unsafeContent,
        streamBytesConsumed: streamBytesConsumed,
    };
}  

// This "l33t-zlib" format was used in the original AoM (and probably AoE3 as well)
// This means that passing non-retold recorded games (and some other formats, like .scx scenarios) WILL decompress correctly
async function decompressL33tZlib(compressed: ArrayBuffer): Promise<Buffer>
{
    console.log("Starting decompress...");
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
        console.error("Decompression error: " + err);
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

function findBuildInfoString(decompressed: Buffer)
{
    // Find the build string, for the beta this was "AoMRT_s.exe 452295 //stream/Athens/beta"
    // Given this is using a beta build the binary might not always be called "AoMRT_s.exe" 
    // But as it's encoded like all the other strings, if we can search for something that is always in it (".exe"), we can go back until we find a null byte
    // and that should always be the two high bytes of the string length field - as the length of the executable name shouldn't exceed 65536 in anyone's lifetime
    // Again we make the assumption that nothing before this happens to contains these bytes, but given it's the very first utf16 text in the file that seems VERY unlikely
    const encodedExe = encodeUtf16(".exe");
    let buildInfoOffset = decompressed.indexOf(encodedExe);
    if (buildInfoOffset < 0)
    {
        throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause: "Failed to find build info string"});
    }
    const view = new DataView(decompressed.buffer);
    let currentCharByte = view.getUint8(buildInfoOffset);
    while (currentCharByte != 0 && buildInfoOffset > 2)
    {
        buildInfoOffset -= 2;
        currentCharByte = view.getUint8(buildInfoOffset);
    }
    // Go back two more, so that we have the offset of the length of the build info string
    buildInfoOffset -= 2;
    if (currentCharByte != 0 || buildInfoOffset < 0)
    {
        throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause: "Failed to backtrack to start of build info string"});
    }
    return readString(decompressed.buffer, buildInfoOffset).content;
}

async function parseMetadataFromDecompressedRecordedGame(decompressed: Buffer): Promise<RecordedGameMetadata>
{
    const view = new DataView(decompressed.buffer);
    const buildInfoString = findBuildInfoString(decompressed);
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
    // In the beta build, the metadata keys were always written with "gametype" first
    // The table itself is simply:
    // 1) uint32: number of keys
    // For each key:
    //  1) string (see readString) containing the key's name
    //  2) uint32: key data type
    //  3) variable: key's value

    // I don't know if there are offsets to this anywhere, or if they will be consistent, but simply trying to find the packed string "gamename"
    // and using that to locate the table seems like as good an approach as anything else
    const encodedGameType = encodeUtf16("gamename");
    // Assumption: the first incidence of this encoded string is the metadata
    const metadataOffset = decompressed.indexOf(encodedGameType);
    // Anything that doesn't have the metadata will throw this error, including:
    // 1) Titans/EE recorded games, scenario files...
    // 2) Single player Retold recorded games
    // Check vs 8 (rather than 0) to make sure trying to go backwards to get to the key count can't give also give a negative offset
    if (metadataOffset < 8)
    {
        const benchmarkIndex = decompressed.indexOf(encodeUtf16("benchmark"));
        if (benchmarkIndex < 650 && benchmarkIndex > 0)
        {
            throw new Error(Errors.GAME_IS_BENCHMARK, {cause:"This looks like a recorded game of the benchmark - it is not a multiplayer game!"});
        }
        throw new Error(Errors.NOT_A_MULTIPLAYER_GAME, {cause:"Could not find metadata - ensure this is a multiplayer Retold recorded game"});
    }
    // Go back 8 bytes to get to the number of keys (just going back 4 is the length of the "gametype" string we searched for)
    const keyCountOffset = metadataOffset - 8;
    console.log(`Reading key count at offset ${keyCountOffset}`);
    const keyCount = view.getUint32(keyCountOffset, true);
    // Actual number of keys in beta recorded games = 383
    if (keyCount < 50 || keyCount > 600)
    {
        throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause:`Bad metadata key count: ${keyCount} at ${keyCountOffset}`});
    }
    const output = {
        // 13 total: 12 players plus mother nature
        playerData: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
        buildString: buildInfoString,
        buildNumber: buildNumber,
        parsedAt: new Date(),
    };
    // Points to the length of the string of the first key
    let currentOffset = metadataOffset - 4;
    let foundKeyType3 = false;
    // We need to remember the unescaped player names, because looking up the "real" team ID needs these to search with
    // searching with the escape version won't find anything
    const stringKeysToUnsafeStrings = new Map<string, string>();
    for (let keyIndex=0; keyIndex<keyCount; keyIndex++)
    {
        if (foundKeyType3)
        {
            throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause: `Key index ${keyIndex} found after a type 3, cannot continue due to unknown data length`});
        }
        const keyData = readString(decompressed.buffer, currentOffset);
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
                const keyValueData = readString(decompressed.buffer, currentOffset);
                const keyValue = keyValueData.content;
                currentOffset += keyValueData.streamBytesConsumed;
                stringKeysToUnsafeStrings.set(key, keyValueData.unsafeContent);
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
                throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause:`Metadata key ${key} has unknown type ${keyType}`});
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

    // Now that everything is there, trim output.playerdata to the correct number of players
    typedOutput.playerData.splice(typedOutput.gameNumPlayers+1, 13-typedOutput.gameNumPlayers);

    // Reject any games with AI players
    if (typedOutput.playerData.some((player) => { return player.aiPersonality !== undefined && player.aiPersonality.length > 0}))
    {
        throw new Error(Errors.GAME_HAS_AI_PLAYERS);
    }
    
    if (typedOutput.gameNumPlayers > 2)
    {
        throw new Error(Errors.UNSUPPORTED_GAME_SIZE, {cause:`Currently uploads are limited to 1v1s only - this game has ${typedOutput.gameNumPlayers} players!`});
    }

    parseTeams(typedOutput, decompressed, stringKeysToUnsafeStrings);
    typedOutput.version = REC_PARSER_STRUCTURE_VERSION;
    // Hard to be sure, but the stuff at the end of the file looks like it might be game orders blocks
    // 5 bytes before the end of the file is the highest indexed one - and from comparing recs to their cast videos
    // it looks like this number divided by 20 is the game length in seconds
    const numGameEntriesOffset = decompressed.length - 5;
    const numGameEntries = view.getUint32(numGameEntriesOffset, true);
    typedOutput.gameLength = numGameEntries / 20;
    return typedOutput;
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


function parseTeams(output: RecordedGameMetadata, decompressed: Buffer, stringKeysToUnsafeStrings: Map<string, string>)
{
    // player.teamId == -1 means they were set to random team.
    // I don't know how these "real" team IDs map to the ones parsed from the normal table
    // so if any are random, resolve the whole lot this way
    let hasRandTeams = output.playerData.some((playerData, index) => (index > 0 && playerData.teamId === -1));
    if (hasRandTeams)
    {
        const view = new DataView(decompressed.buffer);
        // Later in the rec there is some structure where the player name appears twice
        // with 9 bytes of something between the end of the first incidence of the name, and the length uint32 of the second
        // Immediately after this looks like a int32 with the actual team ID in
        for (const playerId in output.playerData)
        {
            const playerDataStructure = output.playerData[playerId];
            if (playerDataStructure.id > 0)
            {
                const unsafeName = stringKeysToUnsafeStrings.get(`gameplayer${playerId}name`);
                if (unsafeName === undefined)
                {
                    throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause:`Failed to resolve team for player ${playerId}: their unescaped name wasn't saved properly`});
                }
                const playerNameEncoded = encodeUtf16(unsafeName);
                const playerNameBuffer = new ArrayBuffer(4 + playerNameEncoded.length);
                const playerNameView = new DataView(playerNameBuffer);
                playerNameView.setUint32(0, playerNameEncoded.length/2, true);
                const playerNameArray = new Uint8Array(playerNameBuffer);
                playerNameArray.set(playerNameEncoded, 4);
                
                const expectedOffsetDifference = 9 + playerNameArray.length;
                let lastPosition = 1;
                let successful = false;
                while (lastPosition > 0)
                {
                    let nextPosition = decompressed.indexOf(playerNameArray, lastPosition+1);
                    //console.log(`Offset gap: ${nextPosition - lastPosition}`);
                    if (nextPosition - lastPosition == expectedOffsetDifference)
                    {
                        lastPosition = nextPosition;
                        successful = true;
                        break;
                    }
                    lastPosition = nextPosition;
                }
                if (!successful)
                {
                    throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause: `Failed to resolve real team for player ${playerId} = ${playerDataStructure.name}`});
                }
                const teamOffset = lastPosition + playerNameArray.length;
                const realTeamId = view.getUint32(teamOffset, true);
                if (realTeamId < 0 || realTeamId > 12)
                {
                    throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause:`Failed to resolve real team for player ${playerId}: read bad team id ${realTeamId}`});
                }
                output.playerData[playerId].teamId = realTeamId;
                console.log(`Read the actual teamId for player ${playerId} -> ${realTeamId}`);
            }
        }
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