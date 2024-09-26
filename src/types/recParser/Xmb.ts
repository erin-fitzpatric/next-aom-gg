// XMBs are usually mapped to XML, but making a JS object interface for them makes more sense
// as it'll be easier to work with from JS/TS

/*
    This should interconvert roughly like this
    <tag attrib1="value1" attrib2="value2">value</tag>
    ->
    {
        name: "tag"
        attribs: {"attrib1":"value1", "attrib2":"value2"}
        value: "value"
        children: []
    }
*/
export interface XMBNode
{
    name: string
    attribs: Record<string, string>
    value: string
    children: XMBNode[]
    offsetEnd: number
}

// There's no point in parsing out all the XMB data unless someone cares about it.
// So we can just store a mapping of the names to raw data and parse it only if it's asked for
export type RecordedGameXMBData = Record<string, XMBNode | DataView>;