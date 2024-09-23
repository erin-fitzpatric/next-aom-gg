export type RecordedGameHierarchyItemType = "data" | "container";

export interface BaseRecordedGameHierarchyItem
{
    /**
     * This item's two letter ASCII "code" identifier that seems static for its section across recorded games.
     */
    twoLetterCode: string,
    type: RecordedGameHierarchyItemType,
    /**
     * Offset into the recorded game data where this item started being read.
     */
    offset: number,
    /**
     * Offset into the recorded game data where this item stopped being read.
     */
    offsetEnd: number,

    /**
     * The item in the hierarchy that this item is a child of.
     * The top level container "BG" has this as undefined.
     */
    parent?: BaseRecordedGameHierarchyItem

    /**
     * The two letter code path that reaches this item from the hierarchy root.
     */
    path: string[]
}

export interface RecordedGameHierarchyData extends BaseRecordedGameHierarchyItem
{
    type: "data",
    data: Buffer,
}

export interface RecordedGameHierarchyContainer extends BaseRecordedGameHierarchyItem
{
    type: "container";
    items: RecordedGameHierarchyItem[];
}

export type RecordedGameHierarchyItem = RecordedGameHierarchyContainer | RecordedGameHierarchyData;
