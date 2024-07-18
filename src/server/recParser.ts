"use server";
import { RecParseError, RecordedGameMetadata, RecordedGamePlayerMetadata, RecordedGameMetadataNumbers, RecordedGameMetadataStrings, RecordedGameMetadataBooleans, RecordedGamePlayerMetadataBooleans, RecordedGamePlayerMetadataNumbers, RecordedGamePlayerMetadataStrings } from "@/types/RecordedGame";
import { promisify } from "util";
import { CompressCallback, inflate, InputType } from "zlib";

// The max allowed decomprssed size of files that are passed as "recorded games".
// This needs to be limited to avoid someone uploading a huge zlib decompression bomb and trying to decompress the entire thing in memory
const RECORDED_GAME_MAX_BYTES_TO_DECOMPRESS = 50000000; // 50mb
// Refuse to try to read strings longer than this, as it's indicative that something went wrong
const RECORDED_GAME_MAX_STRING_LENGTH = 500;

const inflatePromisify = promisify((buf: InputType, callback: CompressCallback) => { inflate(buf, {maxOutputLength: RECORDED_GAME_MAX_BYTES_TO_DECOMPRESS}, callback)});

export async function parseRecordedGameMetadata(file: File): Promise<RecordedGameMetadata>
{
    console.log("Starting reading recorded game...");
    const decompressed = await decompressL33tZlib(await file.arrayBuffer());
    return await parseMetadataFromDecompressedRecordedGame(decompressed);
}

// In these files, a string is saved as:
// 1) The number of characters in the string, as a little endian int32
// 2) Bytes of the number of characters in the string, encoded as utf16
// (This means 2 bytes of buffer per character in the string)
function readString(buffer: ArrayBuffer, offset: number): string
{
    const view = new DataView(buffer);
    const stringLength = view.getUint32(offset, true);
    if (stringLength > RECORDED_GAME_MAX_STRING_LENGTH)
    {
        throw new RecParseError(`Attempted to read string at ${offset} with length ${stringLength}`);
    }
    const characterDataSlice = buffer.slice(offset+4, offset+4 + (2*stringLength));
    const uint8CharacterData = new Uint8Array(characterDataSlice);
    const decoder = new TextDecoder("utf-16le");
    return decoder.decode(uint8CharacterData);
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
        throw new RecParseError("Not a valid Age of Mythology file");
    }
    // Next four bytes contain the length of the decompressed data, but we don't really care about that
    //try
    {
        const decompressed = await inflatePromisify(compressed.slice(8));
        return decompressed;
    }
    /*
    catch (err)
    {
        throw new RecParseError("Failed to decompress file");
    }
        */
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
        throw new RecParseError("Could not find metadata - ensure this is a multiplayer Retold recorded game");
    }
    // Go back 8 bytes to get to the number of keys (just going back 4 is the length of the "gametype" string we searched for)
    const view = new DataView(decompressed.buffer);
    const keyCountOffset = metadataOffset - 8;
    console.log(`Reading key count at offset ${keyCountOffset}`);
    const keyCount = view.getUint32(keyCountOffset, true);
    // Actual number of keys in beta recorded games = 383
    if (keyCount < 50 || keyCount > 500)
    {
        throw new RecParseError(`Bad metadata key count: ${keyCount} at ${keyCountOffset}`);
    }
    const output = {
        // 13 total: 12 players plus mother nature
        playerdata: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    };
    // Points to the length of the string of the first key
    let currentOffset = metadataOffset - 4;
    let foundKeyType3 = false;
    for (let keyIndex=0; keyIndex<keyCount; keyIndex++)
    {
        if (foundKeyType3)
        {
            throw new RecParseError("Key found after type 3, cannot read due to unknown data length");
        }
        const key = readString(decompressed.buffer, currentOffset);
        currentOffset += 4 + (key.length*2);
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
                const keyValue = readString(decompressed.buffer, currentOffset);
                currentOffset += (4 + keyValue.length*2);
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
                throw new RecParseError(`Metadata key ${key} has unknown type ${keyType}`);
        }
    }
    const typedOutput = output as RecordedGameMetadata;

    // Make sure all the keys are there that should be there
    let playerDataKeys = RecordedGamePlayerMetadataNumbers as ReadonlyArray<string>;
    playerDataKeys = playerDataKeys.concat(RecordedGamePlayerMetadataStrings as ReadonlyArray<string>);
    playerDataKeys = playerDataKeys.concat(RecordedGamePlayerMetadataBooleans as ReadonlyArray<string>);
    for (const playerIndex in typedOutput.playerdata)
    {
        const playerData = typedOutput.playerdata[playerIndex];
        for (const key of playerDataKeys)
        {
            if (playerData[key as keyof RecordedGamePlayerMetadata] === undefined)
            {
                throw new RecParseError(`Player ${playerIndex} metadata missing required key ${key}`);
            }
        }
    }
    let mainDataKeys = RecordedGameMetadataNumbers as ReadonlyArray<string>;
    mainDataKeys = mainDataKeys.concat(RecordedGameMetadataStrings as ReadonlyArray<string>);
    mainDataKeys = mainDataKeys.concat(RecordedGameMetadataBooleans as ReadonlyArray<string>);
    for (const key of mainDataKeys)
    {
        if (typedOutput[key as keyof RecordedGameMetadata] === undefined)
        {
            throw new RecParseError(`Recorded game metadata missing required key ${key}`);
        }
    }

    // Now that everything is there, trim output.playerdata to the correct number of players
    typedOutput.playerdata.splice(typedOutput.gamenumplayers+1, 13-typedOutput.gamenumplayers);
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

function addMetadataKeyToOutput(output: any, keyName: string, value: number): void
function addMetadataKeyToOutput(output: any, keyName: string, value: string): void
function addMetadataKeyToOutput(output: any, keyName: string, value: boolean): void
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
            throw new RecParseError(`Failed to parse player number from metadata key ${keyName} with value ${value}`);
        }
        const playerNumberLength = playerNumber.toFixed(0).length;
        keyName = keyName.slice(10 + playerNumberLength);
        targetObject = output.playerdata[playerNumber];
    }
    let validKeys: string[] = [];
    let isValidKey = false;
    if (typeof value == "number")
    {
        let placeToSearch = isPlayerKey ? RecordedGamePlayerMetadataNumbers : RecordedGameMetadataNumbers as ReadonlyArray<string>;
        isValidKey = placeToSearch.includes(keyName);
    }
    else if (typeof value == "string")
    {
        let placeToSearch = isPlayerKey ? RecordedGamePlayerMetadataStrings : RecordedGameMetadataStrings as ReadonlyArray<string>;
        isValidKey = placeToSearch.includes(keyName);
    }
    else if (typeof value == "boolean")
    {
        let placeToSearch = isPlayerKey ? RecordedGamePlayerMetadataBooleans : RecordedGameMetadataBooleans as ReadonlyArray<string>;
        isValidKey = placeToSearch.includes(keyName);
    }
    if (!isValidKey)
    {
        console.log(`Discarded key ${keyName} value ${value}`);
        return;
    }
    targetObject[keyName] = value;
}