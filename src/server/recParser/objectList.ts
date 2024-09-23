
// At the moment I don't have a use for this, but it's mostly here as an example of how to parse the embedded object list.
// This could be used to do things like...
// - Determine map variants (eg 1 vs 2 gold ghost lakes)
// - Try to create a minimap mockup for a game preview

import { RecordedGameHierarchyContainer } from "@/types/recParser/Hierarchy"
import { traverseRecordedGameHierarchy } from "./hierarchy"
import { Errors } from "@/utils/errors"

interface RecordedGameWorldObject
{
    id: number
    owner: number
    positionX: number
    positionZ: number
    protoUnit: number
}

export function readRecordedGameObjectList(root: RecordedGameHierarchyContainer): RecordedGameWorldObject[]
{
    const worldObjectData = traverseRecordedGameHierarchy(root, ["J1", "KB", "KB"], "container");
    if (worldObjectData.length < 2)
        throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause:`readRecordedGameObjectList: expected at least 2 items of worldObjectData, got ${worldObjectData.length}`});
    let playerId = 0;
    const objectList: RecordedGameWorldObject[] = [];
    for (const container of worldObjectData)
    {
        for (const entry of container.items.filter((item) => item.twoLetterCode == "K9"))
        {
            if (entry.type == "data")
            {
                const view = new DataView(entry.data.buffer, entry.data.byteOffset);
                const obj: RecordedGameWorldObject =
                {
                    id: view.getUint32(0, true),
                    owner: playerId,
                    protoUnit: view.getUint32(4, true),
                    positionX: view.getFloat32(10, true),
                    positionZ: view.getFloat32(14, true),
                };
                objectList.push(obj);
            }
        }
        playerId++;
    }
    return objectList;
}