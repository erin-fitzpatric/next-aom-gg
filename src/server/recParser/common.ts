import { Errors } from "@/utils/errors";


interface ParsedString
{
    content: string,
    unsafeContent: string,
    streamBytesConsumed: number,
};

// Refuse to try to read strings longer than this, as it's indicative that something went wrong
const RECORDED_GAME_MAX_STRING_LENGTH = 500;

// A word on DataViews and Buffers:
// They don't make a copy of the underlying data.
// Instead, if you make subarrays from them, they keep a reference to the data and remember
// their new bounds.

// Problem is that when you make a DataView of a Buffer with a byteOffset, unless you explicitly pass the byteOffset
// the DataView will revert back to 0 and you start reading at the start of the decompressed file again...

// This ugly TS makes handling that a lot easier.

function makeDataView(bufferOrArrayBuffer: ArrayBuffer | Buffer | DataView): DataView
{
    const untyped = bufferOrArrayBuffer as any;
    if (untyped.getInt8) // Is DataView already
        return untyped;
    if (untyped.byteOffset !== undefined) // Is Buffer
        return new DataView(untyped.buffer, untyped.byteOffset);
    return new DataView(untyped); // Is ArrayBuffer
}



// In these files, a string is saved as:
// 1) The number of characters in the string, as a little endian int32
// 2) Bytes of the number of characters in the string, encoded as utf16
// (This means 2 bytes of buffer per character in the string)
export function readRecordedGameString(bufferOrDataView: ArrayBuffer | Buffer | DataView, offset: number): ParsedString
{
    let view: DataView = makeDataView(bufferOrDataView);

    const stringLength = view.getUint32(offset, true);
    if (stringLength > RECORDED_GAME_MAX_STRING_LENGTH)
    {
        throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause:`Attempted to read string at ${offset+view.byteOffset} with illegal length ${stringLength}`});
    }
    const characterDataSlice = view.buffer.slice(view.byteOffset + offset+4, view.byteOffset + offset+4 + (2*stringLength));
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