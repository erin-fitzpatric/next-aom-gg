import { RecordedGameRefinedCommands, RawGameCommandListEntry, RawGameCommand, RawGameCommandFooter, Vector3, GameCommandRefiner, RawArgumentParsingFunction, GameCommandTask, GameCommandResearch, GameCommandTrain, GameCommandBuild, GameCommandSetGatherPoint, GameCommandDelete, GameCommandStop, GameCommandUseProtoPower, GameCommandMarketBuySellResources, GameCommandUngarrison, GameCommandResign, GameCommandUnknown18, GameCommandTribute, GameCommandFinishUnitTransform, GameCommandSetUnitStance, GameCommandChangeDiplomacy, GameCommandTownBell, GameCommandAutoScoutEvent, GameCommandChangeControlGroupContents, GameCommandRepair, GameCommandTaunt, GameCommandCheat, GameCommandCancelQueuedItem, GameCommandSetFormation, GameCommandStartUnitTransform, GameCommandUnknown55, GameCommandAutoqueue, GameCommandToggleAutoUnitAbility, GameCommandTimeshift, GameCommandBuildWallConnector, GameCommandSeekShelter, GameCommandPrequeueTech, GameCommandPrebuyGodPower, RawGameCommandArgumentTypes, RefinedGameCommand, BaseRefinedGameCommand } from "@/types/recParser/GameCommands";
import { RecordedGameHierarchyContainer } from "@/types/recParser/Hierarchy";
import { Errors } from "@/utils/errors";

// Parsing the game's raw command list, first into a raw form, and then refining it into something that's much more tolerable to work with.

// This is probably slightly excessive for what it can be used for, because there is no way to track unit IDs through the game
// making a lot of the exposed detail pretty useless, for now at least...

// Some arguments are being discarded here. It's very possible that there is some more usable info in here that could be gained, if there was ever a need to do so
// (which is the reason for exposing the raw commands as well)

const FOOTER: Uint8Array = new Uint8Array([0, 1, 0, 0, 0, 0, 0, 0, 0, 0]);


const unpackInt32: RawArgumentParsingFunction = {bytesConsumed: 4, func: (view, offset) => view.getInt32(offset, true)};
const unpackUint32: RawArgumentParsingFunction = {bytesConsumed: 4, func: (view, offset) => view.getUint32(offset, true)};
const unpackFloat: RawArgumentParsingFunction = {bytesConsumed: 4, func: (view, offset) => view.getFloat32(offset, true)};
const unpackInt8: RawArgumentParsingFunction = {bytesConsumed: 1, func: (view, offset) => view.getInt8(offset)};
const unpackVector: RawArgumentParsingFunction = {bytesConsumed: 12, func: (view, offset) => { return[view.getFloat32(offset, true), view.getFloat32(offset+4, true), view.getFloat32(offset+8, true)]}};

// The keys of this are each command's internal enum value
const commandRefiners: Record<number, GameCommandRefiner> = {
    0: {
        type: "task",
        parseFunctions: [unpackInt32, unpackInt32, unpackInt32, unpackInt32, unpackVector, unpackFloat, unpackInt32, unpackInt32, unpackInt32],
        refinerFunction: (base: any, raw) => {
            base.sourceUnits = raw.sourceUnits;
            base.queued = raw.preArgumentBytes[0] & 2;
            base.targetUnit = raw.argumentList[2];
            base.location = raw.argumentList[4];
            if (raw.sourceVectors.length > 0)
                base.location = raw.sourceVectors[0];
            base.subtype = "unknown";
            if (raw.preArgumentBytes[0] & 1) // Movement type actions
            {
                if (raw.preArgumentBytes[2] == 0x26) // May be tied to bit 4 instead
                    base.subtype = "attackMove";
                else if (raw.preArgumentBytes[2] == 0x23) // May be tied to bit 1 instead
                    base.subtype = "patrol";
                else if (raw.preArgumentBytes[2] == 0x22)
                    base.subtype = "move";
                else
                    base.warning = `Task action ending at ${raw.offsetEnd}: movement type bit set: no known subtype with bitmask ${raw.preArgumentBytes[2]}`;
            }
            else    // Working-type actions
            {
                if (raw.preArgumentBytes[2] == 0x26) // May be tied to bit 4 instead
                    base.subtype = "garrison";
                else if (raw.preArgumentBytes[2] == 0x22)
                    base.subtype = "work";
                else
                    base.warning = `Task action ending at ${raw.offsetEnd}: movement type bit unset: no known subtype with bitmask ${raw.preArgumentBytes[2]}`;
            }
            return base as GameCommandTask;
        }
    },
    1: {
        type: "research",
        parseFunctions: [unpackInt32, unpackInt32, unpackInt32],
        refinerFunction: (base: any, raw) => {
            base.sourceUnits = raw.sourceUnits;
            base.tech = raw.argumentList[2];
            return base as GameCommandResearch;
        }
    },
    2: {
        type: "train",
        parseFunctions: [unpackInt32, unpackInt32, unpackInt32, unpackInt32, unpackInt8, unpackInt8],
        refinerFunction: (base: any, raw) => {
            base.sourceUnits = raw.sourceUnits;
            base.protoUnit = raw.argumentList[2];
            base.quantity = raw.argumentList[5];
            return base as GameCommandTrain;
        }
    },
    3: {
        type: "build",
        parseFunctions: [unpackInt32, unpackInt32, unpackInt32, unpackVector, unpackInt32, unpackInt32, unpackFloat, unpackInt32, unpackInt32, unpackInt32, unpackInt32],
        refinerFunction: (base: any, raw) => {
            base.sourceUnits = raw.sourceUnits;
            base.queued = raw.preArgumentBytes[0] & 2;
            base.protoUnit = raw.argumentList[2];
            base.location = raw.argumentList[3];
            return base as GameCommandBuild;
        }
    },
    4: {
        type: "setGatherPoint",
        parseFunctions: [unpackInt32, unpackInt32, unpackVector, unpackFloat, unpackInt32, unpackInt32],
        refinerFunction: (base: any, raw) => {
            base.sourceUnits = raw.sourceUnits;
            base.countsForCPM = false;
            base.location = raw.argumentList[2];
            return base as GameCommandSetGatherPoint;
        }
    },
    7: {
        type: "delete",
        parseFunctions: [unpackInt32, unpackInt32, unpackInt8],
        refinerFunction: (base: any, raw) => {
            base.sourceUnits = raw.sourceUnits;
            return base as GameCommandDelete;
        }
    },
    9: {
        type: "stop",
        parseFunctions: [unpackInt32, unpackInt32],
        refinerFunction: (base: any, raw) => {
            base.sourceUnits = raw.sourceUnits;
            return base as GameCommandStop;
        }
    },
    12: {
        type: "useProtoPower",
        parseFunctions: [unpackInt32, unpackInt32, unpackInt32, unpackVector, unpackVector, unpackInt32, unpackInt32, unpackFloat, unpackInt32, unpackInt32, unpackInt8],
        refinerFunction: (base: any, raw) => {
            base.sourceUnits = raw.sourceUnits;
            base.queued = raw.preArgumentBytes[0] & 2;
            base.protoPower = raw.argumentList[9];
            base.location = raw.argumentList[3];
            base.location2 = raw.argumentList[4];
            return base as GameCommandUseProtoPower;
        }
    },
    13: {
        type: "marketBuySellResources",
        parseFunctions: [unpackInt32, unpackInt32, unpackInt32, unpackInt32, unpackFloat],
        refinerFunction: (base: any, raw) => {
            base.resourceId = raw.argumentList[2];
            base.resourceType = "unknown";
            if (base.resourceId == 1) base.resourceType = "wood";
            else if (base.resourceId== 2) base.resourceType = "food";
            else
                base.warning = `marketBuySellResources at ${raw.offsetEnd}: illegal resource type index ${raw.argumentList[2]}`;
            base.quantity = raw.argumentList[4];
            base.action = "buy";
            if (base.quantity < 0)
            {
                base.quantity = -1*base.quantity;
                base.action = "sell";
            }
            return base as GameCommandMarketBuySellResources;
        }
    },
    14: {
        type: "ungarrison",
        parseFunctions: [unpackInt32, unpackInt32],
        refinerFunction: (base: any, raw) => {
            base.sourceUnits = raw.sourceUnits;
            return base as GameCommandUngarrison;
        }
    },
    16: {
        type: "resign",
        parseFunctions: [unpackInt32, unpackInt32, unpackInt32, unpackInt32, unpackInt32, unpackInt8],
        refinerFunction: (base: any, raw) => {
            base.isAcknowledgement = raw.argumentList[5] != 0;
            base.resigningPlayer = raw.argumentList[2];
            return base as GameCommandResign;
        }
    },
    18: {
        type: "unk18",
        parseFunctions: [unpackInt32, unpackInt32, unpackInt32],
        refinerFunction: (base: any, raw) => {
            base.sourceUnits = raw.sourceUnits;
            return base as GameCommandUnknown18;
        }
    },
    19: {
        type: "tribute",
        parseFunctions: [unpackInt32, unpackInt32, unpackInt32, unpackInt32, unpackFloat, unpackFloat, unpackInt8],
        refinerFunction: (base: any, raw) => {
            base.resourceType = "unknown";
            base.resourceId = raw.argumentList[2];
            if (base.resourceId == 0) base.resourceType = "gold";
            else if (base.resourceId == 1) base.resourceType = "wood";
            else if (base.resourceId == 2) base.resourceType = "food";
            else
                base.warning = `tribute at ${raw.offsetEnd}: invalid resource type index ${raw.argumentList[2]}`;
            base.sendToPlayer = raw.argumentList[3];
            base.quantity = raw.argumentList[4];
            return base as GameCommandTribute;
        }
    },
    23: {
        type: "finishUnitTransform",
        parseFunctions: [unpackInt32, unpackInt32, unpackInt32, unpackInt8, unpackInt8],
        refinerFunction: (base: any, raw) => {
            base.sourceUnits = raw.sourceUnits;
            base.protoUnit = raw.argumentList[2];
            return base as GameCommandFinishUnitTransform;
        }
    },
    25: {
        type: "setUnitStance",
        parseFunctions: [unpackInt32, unpackInt32, unpackInt8, unpackInt8, unpackInt32],
        refinerFunction: (base: any, raw) => {
            base.sourceUnits = raw.sourceUnits;
            base.stance = "unknown";
            base.stanceId = raw.argumentList[2];
            if (raw.argumentList[2] == 0) base.stance = "aggressive";
            else if (raw.argumentList[2] == 1) base.stance = "defensive";
            else if (raw.argumentList[2] == 2) base.stance = "standGround";
            else if (raw.argumentList[2] == 3) base.stance = "noAttack";
            else
                base.warning = `setUnitStance at ${raw.offsetEnd}: unknown stance index ${raw.argumentList[2]}`;
            return base as GameCommandSetUnitStance;
        }
    },
    26: {
        type: "changeDiplomacy",
        parseFunctions: [unpackInt32, unpackInt32, unpackInt8, unpackInt32],
        refinerFunction: (base: any, raw) => {
            base.sourceUnits = raw.sourceUnits;
            base.diplomacy = "unknown";
            base.diplomacyId = raw.argumentList[2];
            base.targetPlayer = raw.argumentList[3];
            if (raw.argumentList[2] == 1) base.stance = "ally";
            else if (raw.argumentList[2] == 2) base.stance = "enemy";
            else if (raw.argumentList[2] == 3) base.stance = "neutral";
            else
                base.warning = `changeDiplomacy at ${raw.offsetEnd}: unknown diplomatic relation index ${raw.argumentList[2]}`;
            return base as GameCommandChangeDiplomacy;
        }
    },
    34: {
        type: "townBell",
        parseFunctions: [unpackInt32, unpackInt32],
        refinerFunction: (base: any, raw) => {
            base.sourceUnits = raw.sourceUnits;
            return base as GameCommandTownBell;
        }
    },
    35: {
        type: "autoScoutEvent",
        parseFunctions: [unpackInt32, unpackInt32, unpackInt32],
        refinerFunction: (base: any, raw) => {
            base.countsForCPM = false;
            base.sourceUnits = raw.sourceUnits;
            base.location = raw.sourceVectors[0];
            return base as GameCommandAutoScoutEvent;
        }
    },
    37: {
        type: "changeControlGroupContents",
        parseFunctions: [unpackInt32, unpackInt32, unpackInt8, unpackInt32],
        refinerFunction: (base: any, raw) => {
            base.countsForCPM = false;
            base.sourceUnits = raw.sourceUnits;
            if (raw.argumentList[2] == 0) base.action = "remove";
            else base.action = "add";
            base.controlGroupIndex = raw.argumentList[3];
            return base as GameCommandChangeControlGroupContents;
        }
    },
    38: {
        type: "repair",
        parseFunctions: [unpackInt32, unpackInt32, unpackInt32],
        refinerFunction: (base: any, raw) => {
            base.queued = raw.preArgumentBytes[0] & 2;
            base.sourceUnits = raw.sourceUnits;
            base.target = raw.argumentList[2];
            return base as GameCommandRepair;
        }
    },
    41: {
        type: "taunt",
        parseFunctions: [unpackInt32, unpackInt32, unpackInt32, unpackInt32, unpackInt32, unpackInt32, unpackInt32, unpackInt32, unpackInt32, unpackInt32, unpackInt32, unpackInt8],
        refinerFunction: (base: any, raw) => {
            base.tauntNumber = raw.argumentList[2];
            return base as GameCommandTaunt;
        }
    },
    44: {
        type: "cheat",
        parseFunctions: [unpackInt32, unpackInt32, unpackInt32, unpackInt32],
        refinerFunction: (base: any, raw) => {
            base.cheatNumber = raw.argumentList[2];
            return base as GameCommandCheat;
        }
    },
    45: {
        type: "cancelQueuedItem",
        parseFunctions: [unpackInt32, unpackInt32, unpackInt32, unpackInt32, unpackInt32],
        refinerFunction: (base: any, raw) => {
            base.sourceUnits = raw.sourceUnits;
            return base as GameCommandCancelQueuedItem;
        }
    },
    48: {
        type: "setFormation",
        parseFunctions: [unpackInt32, unpackInt32, unpackInt32, unpackInt32],
        refinerFunction: (base: any, raw) => {
            base.sourceUnits = raw.sourceUnits;
            base.formation = "unknown";
            base.formationId = raw.argumentList[2];
            if (base.formationId == 0) base.formation = "line";
            else if (base.formationId == 1) base.formation = "box";
            else if (base.formationId == 2) base.formation = "spread";
            else
                base.warning = `setFormation at ${raw.offsetEnd}: unknown formation index ${raw.argumentList[2]}`;
            return base as GameCommandSetFormation;
        }
    },
    53: {
        type: "startUnitTransform",
        parseFunctions: [unpackInt32, unpackInt32, unpackInt32],
        refinerFunction: (base: any, raw) => {
            base.sourceUnits = raw.sourceUnits;
            base.protoUnit = raw.argumentList[2];
            return base as GameCommandStartUnitTransform;
        }
    },
    55: {
        type: "unk55",
        parseFunctions: [unpackInt32, unpackInt32, unpackVector],
        refinerFunction: (base: any, raw) => {
            base.position = raw.argumentList[2];
            return base as GameCommandUnknown55;
        }
    },
    66: {
        type: "autoqueue",
        parseFunctions: [unpackInt32, unpackInt32, unpackInt32],
        refinerFunction: (base: any, raw) => {
            base.sourceUnits = raw.sourceUnits;
            base.protoUnit = raw.argumentList[2];
            return base as GameCommandAutoqueue;
        }
    },
    67: {
        type: "toggleAutoUnitAbility",
        parseFunctions: [unpackInt32, unpackInt32, unpackInt8],
        refinerFunction: (base: any, raw) => {
            base.sourceUnits = raw.sourceUnits;
            base.abilityIndex = raw.argumentList[2];
            return base as GameCommandToggleAutoUnitAbility;
        }
    },
    68: {
        type: "timeshift",
        parseFunctions: [unpackInt32, unpackInt32, unpackVector, unpackVector],
        refinerFunction: (base: any, raw) => {
            base.sourceUnits = raw.sourceUnits;
            base.location = raw.sourceVectors[0];
            return base as GameCommandTimeshift;
        }
    },
    69: {
        type: "buildWallConnector",
        parseFunctions: [unpackInt32, unpackInt32, unpackInt32, unpackVector, unpackVector],
        refinerFunction: (base: any, raw) => {
            base.countsForCPM = false;
            base.protoUnit = raw.argumentList[2];
            base.location = raw.argumentList[3];
            base.location2 = raw.argumentList[4];
            return base as GameCommandBuildWallConnector;
        }
    },
    71: {
        type: "seekShelter",
        parseFunctions: [unpackInt32, unpackInt32],
        refinerFunction: (base: any, raw) => {
            base.sourceUnits = raw.sourceUnits;
            return base as GameCommandSeekShelter;
        }
    },
    72: {
        type: "prequeueTech",
        parseFunctions: [unpackInt32, unpackInt32, unpackInt32, unpackInt8],
        refinerFunction: (base: any, raw) => {
            base.sourceUnits = raw.sourceUnits;
            base.tech = raw.argumentList[2];
            return base as GameCommandPrequeueTech;
        }
    },
    75: {
        type: "prebuyGodPower",
        parseFunctions: [unpackInt32, unpackInt32, unpackInt32, unpackInt32],
        refinerFunction: (base: any, raw) => {
            base.protoPower = raw.argumentList[2];
            return base as GameCommandPrebuyGodPower;
        }
    },
}

function getCommandRefiner(commandType: number, offset: number): GameCommandRefiner
{
    const refiner = commandRefiners[commandType];
    if (refiner === undefined)
        throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause: `getCommandRefiner: Encountered unknown command type ${commandType} at ${offset}`});
    return refiner;
}

function refineGameCommand(raw: RawGameCommand, commandListIndex: number): RefinedGameCommand
{
    const refiner = getCommandRefiner(raw.commandType, raw.offsetEnd);
    const base: BaseRefinedGameCommand = {
        playerId: raw.playerId,
        commandType: refiner.type,
        countsForCPM: true,
        gameTime: commandListIndex/20,
    };
    return refiner.refinerFunction(base, raw);
}

function parseRawGameCommand(view: DataView, offset: number): RawGameCommand
{
    let tenBytes = view.buffer.slice(offset, offset+10);
    const tenBytesOffset = offset;
    const commandType = view.getUint8(offset+1);
    //console.log(`parseRawGameCommand starting at ${offset}, commandType ${commandType}`);
    const unknowns: Record<string, any> = {};
    offset += 10;
    // 14 (ungarrison) has 30 bytes instead of 10 for some reason
    if (commandType == 14)
    {
        tenBytes = view.buffer.slice(offset-10, offset+20);
        offset += 20;
    }
    else
    {
        // All others have a run of 8x FF bytes at this position
        const ffBytes = view.getBigInt64(offset, true);
        if (ffBytes != BigInt(-1))
            throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause: `parseRawGameCommand: expected run of 8x FF at ${offset}, got ${ffBytes}`});
        offset += 8;
    }
    const three = view.getUint32(offset, true);
    if (three != 3)
        throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause: `parseRawGameCommand: expected 3 at ${offset}, got ${three}`});
    offset += 4;
    // 19 (tribute) is different here for some reason
    let playerId = -1;
    if (commandType == 19)
    {
        playerId = view.getInt8(tenBytesOffset+7);
        const unk = view.getUint32(offset, true);
        unknowns["CommandType19Int32"] = unk;
        offset += 4;
    }
    else
    {
        const one = view.getUint32(offset, true);
        if (one != 1)
            throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause: `parseRawGameCommand: expected 1 at ${offset}, got ${one}`});
        offset += 4;
        playerId = view.getUint32(offset, true);
        if (playerId > 12)
            throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause: `parseRawGameCommand: bad player ID ${playerId} at ${offset}`});
        offset += 4;
    }
    const unkAfterPlayerId = view.getUint32(offset, true);
    unknowns["UnkAfterPlayerID"] = unkAfterPlayerId;
    offset += 4
    const numUnits = view.getUint32(offset, true);
    offset += 4;
    const sourceUnits: number[] = [];
    for (let i=0; i<numUnits; i++)
    {
        sourceUnits.push(view.getUint32(offset, true));
        offset += 4;
    }
    const numVectors = view.getUint32(offset, true);
    offset += 4;
    const sourceVectors: Vector3[] = [];
    for (let i=0; i<numVectors; i++)
    {
        sourceVectors.push([view.getFloat32(offset, true), view.getFloat32(offset+4, true), view.getFloat32(offset+8, true)]);
        offset += 12;
    }
    const numPreArgumentBytes = 13 + view.getUint32(offset, true);
    offset += 4;
    const preArgumentBytes: number[] = [];
    for (let i=0; i<numPreArgumentBytes; i++)
        preArgumentBytes.push(view.getUint8(offset+i))
    offset += numPreArgumentBytes;
    //console.log(`Before args at ${offset}`);
    const refiner = getCommandRefiner(commandType, offset);
    const argList: RawGameCommandArgumentTypes[] = [];
    for (const parseFunctionData of refiner.parseFunctions)
    {
        const value = parseFunctionData.func(view, offset);
        offset += parseFunctionData.bytesConsumed;
        argList.push(value);
    }
    //console.log(`parseRawGameCommand finished at ${offset}`);
    return {
        argumentList: argList,
        commandType: commandType,
        offsetEnd: offset,
        playerId: playerId,
        preArgumentBytes: preArgumentBytes,
        sourceUnits: sourceUnits,
        sourceVectors: sourceVectors,
        tenBytes: tenBytes,
        unknowns: unknowns     
    };
}

// Okay, this maybe isn't a footer. I thought it was a footer when I first dug the file, only to find I didn't correctly place the start of the structures
// ... but I have no idea what else to call it!
function parseRawGameCommandFooter(view: DataView, offset: number): RawGameCommandFooter
{
    //console.log(`parseRawGameCommandFooter at ${offset}`);
    const early = view.buffer.slice(offset, offset+10);
    const extraByteCount = view.getUint8(offset);
    offset++;
    const extraBytes: number[] = [];
    for (let i=0; i<extraByteCount; i++)
        extraBytes.push(view.getUint8(offset+i));

    offset += extraByteCount;
    if (extraByteCount > 0)
    {
        console.log(`parseRawGameCommandFooter has ${extraByteCount} extra bytes: ${extraBytes}`);
    }
    const unk = view.getUint8(offset);
    if (unk != 1)
        throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause: `parseRawGameCommandFooter: expected unk=1 at ${offset}, got ${unk}`});
    offset += 9;
    const footerLengthDividedByFour = view.getUint32(offset, true);
    offset += 4
    const endOffset = offset + (4 * footerLengthDividedByFour);
    const late = view.buffer.slice(offset, endOffset);
    return {
        early: early,
        extraBytes: extraBytes,
        late: late,
        offsetEnd: endOffset
    };
}

function parseRawGameCommandListEntry(view: DataView, offset: number): RawGameCommandListEntry
{
    const entryType = view.getUint32(offset, true);
    //console.log(`parseRawGameCommandListEntry starting at ${offset}, entryType ${entryType}`);
    // entryType is a bitmask.
    // 1: If set, unknown int8 is immediately afterwards. If not set, it's a (negative) int32 instead.
    // 32: This entry contains commands. The number of entries is a uint8
    // 64: This entry contains commands. The number of entries is a uint32 (used when >255 commands in a single list entry, eg pause the game and spam commands)
    // 128: This entry contains info about the player who recorded the game's unit selection changing
    offset += 4;

    const unknowns: Record<string, any> = {};
    unknowns["EarlyByte"] = view.getUint8(offset);
    offset++;
    // Other values are unknown and we should reject them
    if ((entryType & 225) != entryType)
        throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause: `parseRawGameCommandListEntry: Entry at offset ${offset} has unknown entryType bits ${entryType}`});
    // 32+64 together makes no sense
    if ((entryType & 96) == 96)
        throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause: `parseRawGameCommandListEntry: Entry at offset ${offset} has 32+64 set simultaneously`});
    // Handle 1
    if ((entryType & 1) == 0)
    {
        const unk = view.getInt32(offset, true);
        if (unk >= 0)
            throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause: `parseRawGameCommandListEntry: Entry at offset ${offset}: entryType bit 1 is not set, unk int32 is positive = ${unk}`});
        unknowns["EntryType1Int32"] = unk;
        offset += 4;
    }
    else
    {
        const unk = view.getUint8(offset);
        unknowns["EntryType1Byte"] = unk;
        offset += 1;
    }
    const commands: RawGameCommand[] = [];
    // Handle the two kinds of command containing data
    if (entryType & 96)
    {
        let numItems = 0;
        if (entryType & 32)
        {
            numItems = view.getUint8(offset);
            offset++;
        }
        else if (entryType & 64)
        {
            numItems = view.getUint32(offset, true);
            offset += 4;
        }
        for (let i=0; i<numItems; i++)
        {
            const command = parseRawGameCommand(view, offset);
            offset = command.offsetEnd;
            commands.push(command);
        }
    }
    // Handle unit selection change
    const selectedUnits: number[] = [];
    if (entryType & 128)
    {
        const numItems = view.getUint8(offset);
        offset++;
        for (let i=0; i<numItems; i++)
        {
            selectedUnits.push(view.getUint32(offset, true));
            offset += 4;
        }
    }
    const footer = parseRawGameCommandFooter(view, offset);
    offset = footer.offsetEnd;
    const entryIndex = view.getUint32(offset, true);
    offset += 4;
    const finalByte = view.getUint8(offset);
    if (finalByte != 0)
        throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause: `parseRawGameCommandListEntry: Entry at offset ${offset}: expected final byte 0, got ${finalByte}`});

    offset++;

    return {
        entryIndex: entryIndex,
        commands: commands,
        offsetEnd: offset,
        selectedUnits: selectedUnits,
        unknowns: unknowns,
        footer: footer
    }
}

function parseRawGameCommandList(decompressed: Buffer, offset: number): RawGameCommandListEntry[]
{
    const view = new DataView(decompressed.buffer);
    offset = decompressed.indexOf(FOOTER, offset);
    if (offset == -1)
        throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause: "parseRawGameCommandList: couldn't find first footer"});
    const firstFooter = parseRawGameCommandFooter(view, offset);
    offset = firstFooter.offsetEnd + 5;
    let lastIndex = 1;
    let commandList: RawGameCommandListEntry[] = [];
    //console.log(`starting offset: ${offset}`);
    while (true)
    {
        if (offset == view.buffer.byteLength)
            break;
        const thisItem = parseRawGameCommandListEntry(view, offset);
        if (thisItem.entryIndex != lastIndex + 1)
            throw new Error(Errors.PARSER_INTERNAL_ERROR, {cause: `parseRawGameCommandList: expected entry near ${offset} to be sequential to ${lastIndex}, found ${thisItem.entryIndex}`});
        lastIndex++;
        if (thisItem.commands.length > 0 || thisItem.selectedUnits.length > 0 || thisItem.footer.extraBytes.length > 0)
            commandList.push(thisItem);
        offset = thisItem.offsetEnd;
    }
    return commandList;
}


export function parseRecordedGameCommandList(root: RecordedGameHierarchyContainer, decompressed: Buffer): RecordedGameRefinedCommands
{
    try
    {
        const warnings: string[] = [];
        const rawCommands = parseRawGameCommandList(decompressed, root.offsetEnd);
        const commandsByPlayer: Record<number, RefinedGameCommand[]> = {};
        for (const commandListEntry of rawCommands)
        {
            for (const command of commandListEntry.commands)
            {
                const refined = refineGameCommand(command, commandListEntry.entryIndex);
                if (!(refined.playerId in commandsByPlayer))
                {
                    commandsByPlayer[refined.playerId] = [];
                }
                commandsByPlayer[refined.playerId].push(refined);
                if (refined.warning)
                    warnings.push(refined.warning);
            }
        }
        return {
            success: true,
            commandsByPlayer: commandsByPlayer,
            rawCommands: rawCommands,
            warnings: warnings
        };
    }
    catch (e: any)
    {
        //console.log(`parseRecordedGameCommandList failed: ${e}`);
        if (e.cause !== undefined)
        {
            return { success: false, error: e.cause};
        }
        return { success: false, error: e};
    }

}