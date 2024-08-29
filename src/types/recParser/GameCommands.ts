
export type Vector3 = Array<number>;

export type RawGameCommandArgumentTypes = string | number | Vector3 | boolean;

export interface RawGameCommandFooter
{
    early: ArrayBuffer
    extraBytes: number[]
    late: ArrayBuffer
    offsetEnd: number
}

export interface RawGameCommand
{
    /**
     * In most cases, first 10 bytes of the command structure. For ungarrison actions (14) this section is 30 bytes long instead for some reason.
     */
    tenBytes: ArrayBuffer
    /**
     * The command type (internal enum) issued by this command
     */
    commandType: number
    /**
     * The player ID who does this command
     */
    playerId: number
    /**
     * Labelled unknown objects found while parsing this command.
     */
    unknowns: Record<string, any>
    /**
     * The list of units that were doing the command
     */
    sourceUnits: number[]
    /**
     * A list of vectors that might be somehow involved in the command
     */
    sourceVectors: Vector3[]
    /**
     * A series of bytes before the command arguments that encodes things about the action (eg whether it was queued). The exact number of these is variable.
     */
    preArgumentBytes: number[]
    /**
     * The command arguments in array form. This will be an array of mixed types.
     */
    argumentList: RawGameCommandArgumentTypes[]
    /**
     * File offset at the end of this command.
     */
    offsetEnd: number
}

export interface RawGameCommandListEntry
{
    /**
     * Index into the recorded game's command list. The game writes one of these entries 20 times a second.
     */
    entryIndex: number
    /**
     * Raw commands done in this list.
     */
    commands: RawGameCommand[]
    /**
     * Labelled unknown objects found while parsing this list entry.
     */
    unknowns: Record<string, any>
    /**
     * Whenever the player doing the recording changes their unit selection, the list of selected unit IDs will appear here.
     */
    selectedUnits: number[]
    /**
     * File offset at the end of this entry.
     */
    offsetEnd: number

    footer: RawGameCommandFooter
}

// These action names are unofficial
export type RefinedGameCommandType = "task" | "research" | "train" | "build" | "setGatherPoint" | "delete" | "stop" | "useProtoPower" | "marketBuySellResources" | "ungarrison" | "resign" | "unk18" | "tribute" | "finishUnitTransform" | "setUnitStance" | "changeDiplomacy" | "townBell" | "autoScoutEvent" | "changeControlGroupContents" | "repair" | "taunt" | "cheat" | "cancelQueuedItem" | "setFormation" | "startUnitTransform" | "unk55" | "autoqueue" | "toggleAutoUnitAbility" | "timeshift" | "buildWallConnector" | "seekShelter" | "prequeueTech" | "prebuyGodPower";

export interface BaseRefinedGameCommand
{
    /**
     * The player ID performing the command
     */
    playerId: number
    /**
     * The type (unofficial name) of the action being performed
     */
    commandType: RefinedGameCommandType
    /**
     * Whether or not we count this action to calculate commands per minute
     */
    countsForCPM: boolean
    /**
     * The game time (in seconds) this action takes place
     */
    gameTime: number
    /**
     * Any warnings generated while parsing this command
     */
    warning?: string
}

export interface BaseRefinedGameCommandQueuable extends BaseRefinedGameCommand
{
    /**
     * Whether or not this action was added to the end of the queue (via holding shift)
     */
    queued: boolean
}

export type GameCommandTaskSubtype = "move" | "work" | "garrison" | "attackMove" | "patrol" | "unknown";

export interface GameCommandTask extends BaseRefinedGameCommandQueuable
{
    commandType: "task"
    subtype: GameCommandTaskSubtype
    countsForCPM: true
    sourceUnits: number[]
    targetUnit: number
    location: Vector3
}

export interface GameCommandResearch extends BaseRefinedGameCommand
{
    commandType: "research"
    countsForCPM: true
    sourceUnits: number[]
    tech: number
}

export interface GameCommandTrain extends BaseRefinedGameCommand
{
    commandType: "train"
    countsForCPM: true
    sourceUnits: number[]
    protoUnit: number
    quantity: number
}

export interface GameCommandBuild extends BaseRefinedGameCommandQueuable
{
    commandType: "build"
    countsForCPM: true
    sourceUnits: number[]
    protoUnit: number
    location: Vector3
}

export interface GameCommandSetGatherPoint extends BaseRefinedGameCommand
{
    commandType: "setGatherPoint"
    countsForCPM: false // Currently this command triggers a Task subtype move command immediately afterwards, so we don't want to double count
    sourceUnits: number[]
    targetUnit: number
    location: Vector3
}

export interface GameCommandDelete extends BaseRefinedGameCommand
{
    commandType: "delete"
    countsForCPM: true
    sourceUnits: number[]
}

export interface GameCommandStop extends BaseRefinedGameCommand
{
    commandType: "stop"
    countsForCPM: true
    sourceUnits: number[]
}

export interface GameCommandUseProtoPower extends BaseRefinedGameCommandQueuable
{
    commandType: "useProtoPower"
    countsForCPM: true
    sourceUnits: number[]
    location: Vector3
    location2: Vector3
    protoPower: number
}

type GameResourceTypes = "gold" | "wood" | "food" | "favor" | "unknown"; // 0/1/2/3 internally
type BuyOrSell = "buy" | "sell";

export interface GameCommandMarketBuySellResources extends BaseRefinedGameCommand
{
    commandType: "marketBuySellResources"
    countsForCPM: true
    resourceType: GameResourceTypes
    resourceId: number
    action: BuyOrSell
    quantity: number
}

export interface GameCommandUngarrison extends BaseRefinedGameCommand
{
    commandType: "ungarrison"
    countsForCPM: true
    sourceUnits: number[]
}

export interface GameCommandResign extends BaseRefinedGameCommand
{
    // There's more to this than just a player resigning
    // - in a team game, one player resigning triggers every other player to issue a resign command of their own with different params
    resigningPlayer: number
    isAcknowledgement: boolean
    commandType: "resign"
    countsForCPM: false
}

export interface GameCommandUnknown18 extends BaseRefinedGameCommand
{
    commandType: "unk18"
    countsForCPM: true
    sourceUnits: number[]
}

export interface GameCommandTribute extends BaseRefinedGameCommand
{
    commandType: "tribute"
    countsForCPM: true
    resourceType: GameResourceTypes
    resourceId: number
    quantity: number
    sendToPlayer: number
}

export interface GameCommandFinishUnitTransform extends BaseRefinedGameCommand
{
    commandType: "finishUnitTransform"
    countsForCPM: true
    sourceUnits: number[]
    protoUnit: number
}

type UnitStanceType = "aggressive" | "defensive" | "standGround" | "noAttack" | "unknown"; // 0/1/2/3 internally

export interface GameCommandSetUnitStance extends BaseRefinedGameCommand
{
    commandType: "setUnitStance"
    countsForCPM: true
    sourceUnits: number[]
    stance: UnitStanceType
    stanceId: number
}

type DiplomacyRelation = "ally" | "enemy" | "neutral" | "unknown"; // 1/2/3 internally

export interface GameCommandChangeDiplomacy extends BaseRefinedGameCommand
{
    commandType: "changeDiplomacy"
    countsForCPM: true
    targetPlayer: number
    diplomacy: DiplomacyRelation
    diplomacyId: number
}

export interface GameCommandTownBell extends BaseRefinedGameCommand
{
    commandType: "townBell"
    countsForCPM: true
    sourceUnits: number[]
}

export interface GameCommandAutoScoutEvent extends BaseRefinedGameCommand
{
    commandType: "autoScoutEvent"
    countsForCPM: false
    sourceUnits: number[]
    location: Vector3
}

type ControlGroupChangeAction = "add" | "remove";

export interface GameCommandChangeControlGroupContents extends BaseRefinedGameCommand
{
    commandType: "changeControlGroupContents"
    // Every time you change a control group, the game triggers one event per unit in the group (removing them) and then readds them all, with 1 event per unit
    // Including this would inflate CPM by a LOT.
    countsForCPM: false
    sourceUnits: number[]
    controlGroupIndex: number
    action: ControlGroupChangeAction
}

export interface GameCommandRepair extends BaseRefinedGameCommandQueuable
{
    commandType: "repair"
    countsForCPM: true
    sourceUnits: number[]
    targetUnit: number
}

export interface GameCommandTaunt extends BaseRefinedGameCommand
{
    commandType: "taunt"
    countsForCPM: true
    tauntNumber: number
}

export interface GameCommandCheat extends BaseRefinedGameCommand
{
    commandType: "cheat"
    countsForCPM: true
    cheatNumber: number
}

export interface GameCommandCancelQueuedItem extends BaseRefinedGameCommand
{
    commandType: "cancelQueuedItem"
    countsForCPM: true
    sourceUnits: number[]
    // I do not see any way to resolve the argument int into anything remotely usable unfortunately
}

type FormationType = "line" | "box" | "spread" | "unknown"; // 0/1/2

export interface GameCommandSetFormation extends BaseRefinedGameCommand
{
    commandType: "setFormation"
    countsForCPM: true
    sourceUnits: number[]
    formation: FormationType
    formationId: number
}

export interface GameCommandStartUnitTransform extends BaseRefinedGameCommand
{
    commandType: "startUnitTransform"
    countsForCPM: false // debateable, selecting a lot of units and doing this creates one command per unit transformed
    sourceUnits: number[]
    protoUnit: number
}

export interface GameCommandUnknown55 extends BaseRefinedGameCommand
{
    commandType: "unk55"
    countsForCPM: true
    location: Vector3
}

export interface GameCommandAutoqueue extends BaseRefinedGameCommand
{
    commandType: "autoqueue"
    countsForCPM: true
    sourceUnits: number[]
    protoUnit: number
}

export interface GameCommandToggleAutoUnitAbility extends BaseRefinedGameCommand
{
    commandType: "toggleAutoUnitAbility"
    countsForCPM: true
    sourceUnits: number[]
    abilityIndex: number
}

export interface GameCommandTimeshift extends BaseRefinedGameCommand
{
    commandType: "timeshift"
    countsForCPM: true
    sourceUnits: number[]
    location: Vector3
}

export interface GameCommandBuildWallConnector extends BaseRefinedGameCommand
{
    commandType: "buildWallConnector"
    countsForCPM: false // Making a simple wall puts out a LOT of these.
    // Omission of sourceUnits is intentional, it is filled with the player ID instead!
    protoUnit: number
    location: Vector3
    location2: Vector3
}

export interface GameCommandSeekShelter extends BaseRefinedGameCommand
{
    commandType: "seekShelter" // This a villager UI command that sends them to the nearest garrisonable building
    countsForCPM: true
    sourceUnits: number[]
}

export interface GameCommandPrequeueTech extends BaseRefinedGameCommand
{
    commandType: "prequeueTech" // This a villager UI command that sends them to the nearest garrisonable building
    countsForCPM: true
    sourceUnits: number[]
    tech: number
}

export interface GameCommandPrebuyGodPower extends BaseRefinedGameCommand
{
    commandType: "prebuyGodPower" // This is an AI only action and is how they interact with reusable god powers
    countsForCPM: true
    protoPower: number
}



export type RefinedGameCommand = GameCommandTask | GameCommandResearch | GameCommandTrain | GameCommandBuild | GameCommandSetGatherPoint | GameCommandDelete | GameCommandStop | GameCommandUseProtoPower | GameCommandMarketBuySellResources | GameCommandUngarrison | GameCommandResign | GameCommandUnknown18 | GameCommandTribute | GameCommandFinishUnitTransform | GameCommandSetUnitStance | GameCommandChangeDiplomacy | GameCommandTownBell | GameCommandAutoScoutEvent | GameCommandChangeControlGroupContents | GameCommandRepair | GameCommandTaunt | GameCommandCheat | GameCommandCancelQueuedItem | GameCommandSetFormation | GameCommandStartUnitTransform | GameCommandUnknown55 | GameCommandAutoqueue | GameCommandToggleAutoUnitAbility | GameCommandTimeshift | GameCommandBuildWallConnector | GameCommandSeekShelter | GameCommandPrequeueTech | GameCommandPrebuyGodPower;


export interface RecordedGameRefinedCommands
{
    success: boolean
    rawCommands?: RawGameCommandListEntry[]
    commandsByPlayer?: Record<number, RefinedGameCommand[]>
    error?: string
    warnings?: string[]
}


export interface RawArgumentParsingFunction
{
    func: (view: DataView, offset: number) => any,
    bytesConsumed: number
}

export interface GameCommandRefiner
{
    type: RefinedGameCommandType
    parseFunctions: RawArgumentParsingFunction[]
    refinerFunction: (base: BaseRefinedGameCommand, raw:RawGameCommand) => RefinedGameCommand
}