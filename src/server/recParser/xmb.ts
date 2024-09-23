// Parse XMB data packed in recs.
// Note that this code will NOT work on the XMBs found in .bar files, those contain additional lz4 compression which is not used in the rec files.
// The Aoe3de resource manager can extract those - use that instead!

import { RecordedGameHierarchyContainer } from "@/types/recParser/Hierarchy";
import { traverseRecordedGameHierarchy } from "./hierarchy";
import { readRecordedGameString } from "./common";
import { Errors } from "@/utils/errors";
import { RecordedGameXMBData, XMBNode } from "@/types/recParser/Xmb";
/**
 * Get a mapping of xmb filenames to raw data contained in the recorded game.
 *
 * @export
 * @param {RecordedGameHierarchyContainer} - The hierarchy root of the recorded game.
 * @return {*}  {RecordedGameXMBData}
 */
export function parseRecXMBList(root: RecordedGameHierarchyContainer): RecordedGameXMBData
{
    const nodes = traverseRecordedGameHierarchy(root, ["GM", "GD", "gd"], "data");
    const out: RecordedGameXMBData = {};
    for (const node of nodes)
    {
        const view = new DataView(node.data.buffer, node.data.byteOffset);
        // First byte: unknown
        let offset = 1;
        // Second byte: number of packed XMB files in this block
        const numFiles = view.getUint32(offset, true);
        offset += 4;
        
        for (let fileIndex=0; fileIndex<numFiles; fileIndex++)
        {
            let xmbName = "";
            if (numFiles > 1)
            {
                // Read two strings, keep the second to use as the xmb name
                for (let i=0; i<2; i++)
                {
                    const parsed = readRecordedGameString(view, offset);
                    offset += parsed.streamBytesConsumed;
                    xmbName = parsed.unsafeContent;
                }
            }
            else
            {
                // Read 0x14 bytes into the stream - this gets the first element name
                xmbName = readRecordedGameString(view, offset+0x14).unsafeContent;
            }
            if (view.getUint16(offset, true) != 12632) // "X1" ascii as int16
                throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause: `Bad XMB header at ${offset+node.offset}`});
            const dataLength = view.getUint32(offset+2, true);
            out[xmbName] = new DataView(node.data.buffer, node.data.byteOffset + offset);
            offset += 6 + dataLength;
        }
    }
    return out;
}

function isXMBNode(input: XMBNode | DataView): input is XMBNode
{
    return (input as any).byteLength === undefined;
}

/**
 * Fetch XMB data from a RecordedGameXMBData object.
 *
 * @export
 * @param {RecordedGameXMBData} data
 * @param {string} name The name of the XMB data
 * @return {*}  The XMBNode of the XMB file, or undefined if it doesn't exist.
 */
export function getRecXMB(data: RecordedGameXMBData, name: string): XMBNode | undefined
{
    const saved = data[name];
    if (saved == undefined) return undefined;
    if (isXMBNode(saved))
        return saved;
    const node = parseXMBFromDataView(saved);
    data[name] = node;
    return node;
}

/**
 * Fetch XMB data from a RecordedGameXMBData object. Throws a parser internal error if the requested XMB name wasn't found.
 *
 * @export
 * @param {RecordedGameXMBData} data
 * @param {string} name The name of the XMB data
 * @return {*}  The XMBNode of the XMB file, or undefined if it doesn't exist.
 */
export function getRecXMBStrict(data: RecordedGameXMBData, name: string): XMBNode
{
    const ret = getRecXMB(data, name);
    if (ret === undefined)
        throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause: `XMB parser: Failed to find packed XMB ${name}`});
    return ret;
}

function parseXMBFromDataView(view: DataView, name?: string): XMBNode
{
    const x1 = view.getUint16(0, true);
    if (x1 != 12632) // "X1" ascii as uint16
        throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause: `XMB parser: bad X1 header while parsing ${name}: ${x1}`});
    const xr = view.getUint16(6, true);
    if (xr != 21080) // "XR" ascii as uint16
        throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause: `XMB parser: bad XR header while parsing ${name}: ${xr}`});
    const unk1 = view.getUint32(8, true);
    if (unk1 != 4)
        throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause: `XMB parser: bad header while parsing ${name}: expected 4, got ${unk1}`});
    const version = view.getUint32(12, true);
    if (version != 8)
        throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause: `XMB parser: bad version while parsing ${name}: expected 8, got ${version}`});

    const numElements = view.getUint32(16, true);
    const elements: string[] = [];
    let offset = 20;
    for (let i=0; i<numElements; i++)
    {
        const parsed = readRecordedGameString(view, offset);
        offset += parsed.streamBytesConsumed;
        elements.push(parsed.unsafeContent);
    }

    const numAttributes = view.getUint32(offset, true);
    offset += 4;
    const attributes: string[] = [];
    for (let i=0; i<numAttributes; i++)
    {
        const parsed = readRecordedGameString(view, offset);
        offset += parsed.streamBytesConsumed;
        attributes.push(parsed.unsafeContent);
    }

    return parseXMBNodeRecursive(view, offset, elements, attributes, undefined, name);
}

function parseXMBNodeRecursive(view: DataView, offset: number, elements: string[], attributes: string[], parent?: XMBNode, name?: string): XMBNode
{
    const xn = view.getUint16(offset, true);
    offset += 2;
    if (xn != 20056) // "XN" as uint16
        throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause: `XMB parser: bad XN while parsing ${name}: ${xn} at ${offset}`});
    // unk 4 bytes
    offset += 4;
    const parsedValue = readRecordedGameString(view, offset);
    offset += parsedValue.streamBytesConsumed;
    const value = parsedValue.unsafeContent;
    const nameIndex = view.getUint32(offset, true);
    offset += 4;
    const elementName = elements[nameIndex];
    // unk 4 bytes
    offset += 4;
    const numAttributes = view.getUint32(offset, true);
    offset += 4;
    const thisNode: XMBNode = {
        children: [],
        name: elementName,
        attribs: {},
        value: value,
        offsetEnd: -1,
    }

    for (let i=0; i<numAttributes; i++)
    {
        const attribName = attributes[view.getUint32(offset, true)];
        offset += 4;
        const parsedAttribValue = readRecordedGameString(view, offset);
        offset += parsedAttribValue.streamBytesConsumed;
        const attribValue = parsedAttribValue.unsafeContent;
        thisNode.attribs[attribName] = attribValue;
    }

    if (parent !== undefined)
    {
        parent.children.push(thisNode);
    }

    const numChildren = view.getUint32(offset, true);
    offset += 4;
    //console.log(`Parsed XMB node ${elementName} at ${offset+view.byteOffset} with ${numChildren} children`);
    for (let i=0; i<numChildren; i++)
    {
        const child = parseXMBNodeRecursive(view, offset, elements, attributes, thisNode, name);
        offset = child.offsetEnd;
    }
    thisNode.offsetEnd = offset;
    return thisNode;
}
