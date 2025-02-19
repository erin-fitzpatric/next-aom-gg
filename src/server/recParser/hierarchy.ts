// Recorded games have a hierarchy of sorts, made up of entries in a tree structure.
// Each entry is "named" with a two character code, which seem to be fixed in every rec, and oftentimes are abbreviated forms of
// the data they are about (eg "PL" for player data)
// Entries are either containers, holding an array of subentries, or holding raw binary data.

// This resulting tree structure covers the entire recorded game data contents, from the very start up to the beginning of the command list.
// The command list itself does NOT use this format, and it is simply packed in the file at the end of the outermost hierarchy container.
// A specific two letter code can be used in multiple places in the entire tree.
// Quite frequently, containers will contain multiple subentries with the same two letter code
// eg an array of player data has one "PL" entry per player in the game, and one more for mother nature.

// This means that the different subsections of the file can be navigated using these two letter codes, even with zero understanding of what data the different sections
// actually contain or its format.

// traverseRecordedGameHierarchy will try to navigate the hierarchy given a "path" of codes like a directory structure, which can be used to retrieve
// binary data sections for further parsing.

// About the format:
    // Each section seems to be either a raw data chunk of defined length, or a container containing an array or other data chunks.

    // The format of these is very simply:
    // char[2]: "twoLetterCode" - seemingly an internal "name" for this entry
    // uint32: data size
    // bytes[datasize]: data

    // The data section of "container" types is an array of more of these entries, packed roughly end to end.
    // The data section of "data" types is just arbitrary binary data that the game uses to encode some data.

    // Some entries have more data in them than this, both between the two letter code and data, or extra bytes that seem to belong the the data section despite not fitting in its length.
    // In the case of some containers this is clearly the number of data entries within the container, in many many others I have no idea what this is
    // nor can I find any pattern in it.

    // These inclusions are usually very short - in some cases they apparently aren't always, eg trying to parse ["J1", "TN"] as a container.
    // At least for my purposes, assuming they are all very short seems to have turned out okay. 
    // This unfortunately means using a slightly fuzzy search in the form of scanForSensibleTwoLetterCode, at least for now.

    // This means that I don't know a way to tell in advance if any given entry is raw data or is a container, but with the seemingly fixed nature of these character codes
    // that probably isn't important, as once a section is identified it can always be located assuming that everything above it in the hierarchy is a container.

    // For especially problematic structures that break too many rules and the fuzzy two letter scanner isn't good enough, overriding them on a case-by-case basis should
    // be possible by using their path in the tree as an identifier.

import { RecordedGameHierarchyData, RecordedGameHierarchyContainer, RecordedGameHierarchyItem, RecordedGameHierarchyItemType } from "@/types/recParser/Hierarchy";
import { Errors } from "@/utils/errors";

const MAX_SCAN_LENGTH = 50;
const OUTER_HIERARCHY_START_OFFSET = 0;

interface ParseHierarchyDataOptions
{
    additionalBytesBeforeData?: number
    abortOnScanFailure?: boolean
}

const hierarchyDataContainerParseOverrides: Map<string, (data: RecordedGameHierarchyData) => RecordedGameHierarchyContainer> = new Map([
    ["GM,GD", (data) => {
        // XMB packed data structure
        // Contains 8 extra bytes between length and data start which frequently trips up the fuzzy scanner.
        // int32 unknown - the fuzzy scanner frequently thinks part of this is the two letter code
        // uint32 number of XMB files contained in this block
        return parseHierarchyDataAsContainer(data, {additionalBytesBeforeData: 8}, false);
    }],
    ["J1,KB,KB", (data) => {
        // Per-player KB data, this contains the initial object lists
        // At the end of the object lists, the content just... stops, and becomes a long run of null bytes
        // Looks like just reading until scan failure is a viable strategy for this one
        return parseHierarchyDataAsContainer(data, {abortOnScanFailure: true}, false);
    }]
]
)

function parseHierarchyDataAsContainer(data: RecordedGameHierarchyData, options: ParseHierarchyDataOptions={}, allowCustomHandler=true): RecordedGameHierarchyContainer
{
    const fullPath = [...data.path, data.twoLetterCode].join(",");
    //console.log(`parse ${fullPath} as container`);
    const customHandler = hierarchyDataContainerParseOverrides.get(fullPath);
    if (allowCustomHandler && customHandler)
    {
        //console.log(`Using custom handler for ${fullPath}`);
        return customHandler(data);
    }
    const items: RecordedGameHierarchyItem[] = [];

    const additionalBytesBeforeData = options.additionalBytesBeforeData ?? 0;
    let length = data.data.byteLength - additionalBytesBeforeData;
    let offsetFromFileStart = 6 + data.offset;
    let offsetIntoArray = additionalBytesBeforeData;
    //console.log(`start of buffer sample 2 : ${data.data.subarray(0, 40)}`);
    // Because we are working on a slice of the original file, we need to calculate all the real offsets by using the passed data.offset
    let offsetEnd = offsetFromFileStart + length;
    while (true)
    {
        //console.log(`Start reading container item at ${offsetFromFileStart + offsetIntoArray}`);
        try
        {
            const newItem = readHierarchyData(data.data, offsetIntoArray, length-6, data);
            //console.log(`Finished reading container item ${newItem.twoLetterCode} at ${offsetFromFileStart + newItem.offsetEnd}: it says its offset is ${newItem.offset} and length ${newItem.data.byteLength} and end offset is ${newItem.offsetEnd}`);
            length -= newItem.offsetEnd - offsetIntoArray;
            offsetIntoArray = newItem.offsetEnd;
            // Fix offsets so they're now from the start of the file, not from the start of the new container's data array
            newItem.offset += offsetFromFileStart;
            newItem.offsetEnd += offsetFromFileStart;
            //console.log(`Remaining length = ${length}`);
            items.push(newItem);
            if (length < 0)
            {
                throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause: `Consumed too many bytes (${length} remaining) trying to read container ${data.twoLetterCode} at ${data.offset}: last item = ${newItem.twoLetterCode} at ${newItem.offset}`});
            }
            else if (length == 0)
            {
                break;
            }
        }
        catch (e)
        {
            if (!options.abortOnScanFailure)
                throw e;
            const typedError = e as Error;
            if (typedError.message == Errors.PARSER_INTERNAL_ERROR && typedError.cause)
            {
                if (typeof typedError.cause == "string")
                {
                    if (typedError.cause.startsWith("Failed to scan"))
                    {
                        //console.log(`Planned abortion of container parse with error ${typedError.cause}`);
                        break;
                    }
                }
            }
        }
        
    }
    const out: RecordedGameHierarchyContainer = {twoLetterCode: data.twoLetterCode, items:items, offset:data.offset, type:'container', offsetEnd: offsetEnd, path:data.path};
    return out;
}

function scanForSensibleTwoLetterCode(data: Buffer, startOffset: number, maxLength?: number): number
{
    let view = new DataView(data.buffer);
    for (let i=0; i<MAX_SCAN_LENGTH; i++)
    {
        const realOffset = startOffset + i + data.byteOffset;
        let bad = false;
        // Both of the two character code bytes should be printable ascii characters
        for (let charIndex=0; charIndex<2; charIndex++)
        {
            if (view.getUint8(realOffset+charIndex) < 32)
            {
                //console.log(`Reject ${view.getUint8(realOffset+charIndex)} at ${realOffset+charIndex}`);
                bad = true;
                break;
            }
        }
        if (bad) continue;
        if (maxLength !== undefined)
        {
            const thisDataLength = view.getUint32(realOffset+2, true);
            if (thisDataLength > maxLength)
                continue;
        }
        return realOffset - data.byteOffset;
    }
    throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause: `Failed to scan two letter code at file offset ${startOffset + data.byteOffset}`});
}

function readHierarchyData(data: Buffer, startOffset: number, maxLength?:number, parent?: RecordedGameHierarchyItem): RecordedGameHierarchyData
{
    //console.log(`readHierarchyData at ${startOffset} from buffer with byteoffset ${data.byteOffset}`);
    //console.log(`start of buffer sample early: ${data.subarray(0, 40)}`);
    const view = new DataView(data.buffer);
    startOffset = scanForSensibleTwoLetterCode(data, startOffset, maxLength);
    //console.log(`scan adjusted offset to ${startOffset}`);
    const twoLetterCode = String.fromCharCode(view.getUint8(startOffset + data.byteOffset)) + String.fromCharCode(view.getUint8(startOffset+1 + data.byteOffset));
    let length = view.getUint32(startOffset+2 + data.byteOffset, true);
    const endOffset = startOffset+6+length;
    const rawData = data.subarray(startOffset+6, endOffset);
    //console.log(`rawData for ${twoLetterCode} is ${startOffset+6}:${endOffset} with length ${rawData.length}`);
    //console.log(`start of buffer sample: ${rawData.subarray(0, 40)}`);
    let path: string[] = [];
    if (parent)
    {
        path = [...parent.path];
        // Don't add the top level BG to this
        if (parent.parent)
        {
            path.push(parent.twoLetterCode);
        }
    }
    const out: RecordedGameHierarchyData = {"type":"data", data:rawData, twoLetterCode:twoLetterCode, offset: startOffset, offsetEnd: endOffset, parent:parent, path:path};
    return out;
}

function readHierarchyContainer(data: Buffer, startOffset: number, parent?: RecordedGameHierarchyItem): RecordedGameHierarchyContainer
{
    const hierarchyData = readHierarchyData(data, startOffset, undefined, parent);
    return parseHierarchyDataAsContainer(hierarchyData);
}
/**
 * Read the entire hierarchy packed in a decompressed recorded game.
 * @param {Buffer} decompressed - The decompressed recorded game data
 * @return {*} The top level hierarchy (character code "BG") encompassing all the data in the recorded game up to the command list.
 */
export function parseRecordedGameHierarchy(decompressed: Buffer): RecordedGameHierarchyContainer
{
    const container = readHierarchyContainer(decompressed, OUTER_HIERARCHY_START_OFFSET, undefined);
    if (container.twoLetterCode != "BG")
    {
        throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause:`Expected top level hierarchy container code to be BG, read ${container.twoLetterCode}`});
    }
    return container;
}
/**
 * Traverse a hierarchy container, looking for entries with two letter codes that match a given request.
 * Requests take the form of an array of strings, each with the two letter code of the container(s) leading to them.
 * At each level of the tree, this function will enter ALL entries that match the two letter code at that point.
 * For instance, passing ["J1", "PL", "us"] as a search to the top level hierarchy will:
 * 
 * 1) Finds the J1 entry in the main container (there is always exactly one of these), parses this as a container.
 * 2) Searches J1 for "PL" entries, there is one of these for mother nature and then one more per player in the game. Parses each of these as a container.
 * 3) Searches each PL entry found for "us" entries, each of the PL entries has exactly one of these.
 * 4) Returns an array of the "us" entries, in the order in which they were in the original file.
 * @param {RecordedGameHierarchyContainer} hierarchy
 * @param {string[]} path The list of two letter codes to search for.
 * @param expectedReturnType The data type (data or container) that the final entries are expected to take. If container, they will be parsed into container form before returning.
 * @param [expectedNumItems] If provided: throws an error if the final number of items returned is not exactly this number.
 * @param [depth] For internal recursion depth tracking only. Do not use.
 * @return {*}  An array matching hierarchy entries found at the requested location.
 */
export function traverseRecordedGameHierarchy(hierarchy: RecordedGameHierarchyContainer, path: string[], expectedReturnType: "data", expectedNumItems?: number, depth?: number): RecordedGameHierarchyData[]
export function traverseRecordedGameHierarchy(hierarchy: RecordedGameHierarchyContainer, path: string[], expectedReturnType: "container", expectedNumItems?: number, depth?: number): RecordedGameHierarchyContainer[]
export function traverseRecordedGameHierarchy(hierarchy: RecordedGameHierarchyContainer, path: string[], expectedReturnType: undefined, expectedNumItems?: number, depth?: number): RecordedGameHierarchyItem[]
export function traverseRecordedGameHierarchy(hierarchy: RecordedGameHierarchyContainer, path: string[], expectedReturnType?: RecordedGameHierarchyItemType, expectedNumItems?: number, depth?: number): RecordedGameHierarchyItem[]
{
    if (path.length == 0)
    {
        return [];
    }
    if (depth === undefined)
    {
        depth = 0;
    }
    let matching: RecordedGameHierarchyItem[] = [];
    for (const index in hierarchy.items)
    {
        let item = hierarchy.items[index];
        if (item.twoLetterCode == path[0])
        {
            if (path.length > 1)
            {
                if (item.type == "data")
                {
                    const itemAsContainer = parseHierarchyDataAsContainer(item);
                    hierarchy.items[index] = itemAsContainer;
                    item = itemAsContainer;
                }
                matching = [...matching, ...traverseRecordedGameHierarchy(item, path.slice(1), undefined, undefined, depth+1)];
            }
            else
            {
                matching.push(item);
            }
        }
    }
    // Type check the return values on the outermost call only
    if (depth == 0)
    {
        for (const index in matching)
        {
            let item = matching[index];
            if (item.type == "container" && expectedReturnType == "data")
            {
                throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause: `Traversing ${hierarchy.twoLetterCode} -> ${path}: final item ${item.twoLetterCode} is container but caller expected it to be data`});
            }
            else if (expectedReturnType == "container" && item.type == "data")
            {
                const itemAsContainer = parseHierarchyDataAsContainer(item);
                matching[index] = itemAsContainer;
            }
        }
        if (expectedNumItems !== undefined && matching.length != expectedNumItems)
        {
            throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause: `Traversing ${hierarchy.twoLetterCode} -> ${path}: caller expected ${expectedNumItems} items, but found ${matching.length}: ${matching.forEach((item)=>item.twoLetterCode)}`});
        }
    }
    //console.log(`Traverse ${path}: depth=${depth}: ${matching.length} results = ${matching.map((item)=>{return item.twoLetterCode;})}`);
    return matching;
}

type RecursiveArray<T> = Array<RecursiveArray<T> | T>;

function showHierarchyStructure(item: RecordedGameHierarchyData | RecordedGameHierarchyContainer): string | RecursiveArray<string>
{
    if (item.type == "container")
    {
        const out: RecursiveArray<string> = [`${item.twoLetterCode} at ${item.offset} (${item.items.length} children, ${item.offsetEnd - item.offset - 6}b)`];
        // A simple .map call makes too many nesting levels when it encounters another container
        for (const child of item.items)
        {
            const childOutput = showHierarchyStructure(child);
            if (child.type == "data")
                out.push(childOutput);
            else
            {
                // Pulling the container's info out of its array makes this a LOT less confusing
                out.push(childOutput[0]);
                out.push(childOutput.slice(1));
            }
        }
        return out
    }
    else
    {
        return `${item.twoLetterCode} at ${item.offset} (${item.data.length}b)`
    }
}

/**
 * For debug/exploration purposes: return a pretty string (ready for console.log or other outputting) representing the hierarchy member.
 * This exists in an attempt to make visualising hierarchies, seeing what exists in them, and debugging traversal issues less painful.
 */
export function formatRecordedGameHierarchy(root: RecordedGameHierarchyItem)
{
    return JSON.stringify(showHierarchyStructure(root), undefined, 2);
}