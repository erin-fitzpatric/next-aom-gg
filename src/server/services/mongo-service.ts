"use server";

import RecordedGameModel from "@/db/mongo/model/RecordedGameModel";
import getMongoClient from "@/db/mongo/mongo-client";
import { Filters } from "@/types/Filters";
import { IRecordedGame } from "@/types/RecordedGame";
import { removeMongoObjectID } from "@/utils/utils";
import { PipelineStage } from "mongoose";

export async function queryMythRecs(
  pageIndex: number,
  filters?: Filters
): Promise<IRecordedGame[]> {
  const PAGE_SIZE = 16;
  const offset = pageIndex * PAGE_SIZE;
  await getMongoClient();
  let result;
  try {
    if (!filters) {
      result = await RecordedGameModel.find()
        .lean()
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(PAGE_SIZE);
    } else {
      const aggregateQuery = buildFilterQuery(offset, PAGE_SIZE, filters);
      result = await RecordedGameModel.aggregate(aggregateQuery).exec();
    }

    // Remove _id from each playerData object and the object as a whole
    // This is a nonserialisable property which will cause React warnings when passed to client
    result.map((rec) => {
      removeMongoObjectID(rec.playerData);
    });
    removeMongoObjectID(result);
    return result;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch Myth recordings: " + err);
  }
}

function buildFilterQuery(
  offset: number,
  PAGE_SIZE: number,
  filters?: Filters
): PipelineStage[] {
  const aggregateQuery = <PipelineStage[]>[];
  if (filters) {
    // TODO -we will refactor this later...right???
    const { godIds, mapNames, searchQueryString, buildNumbers } = filters;
    // search
    if (searchQueryString) {
      aggregateQuery.push({
        $match: {
          $or: [
            { gameTitle: { $regex: searchQueryString, $options: "i" } },
            { gameMapName: { $regex: searchQueryString, $options: "i" } },
            { "playerData.name": { $regex: searchQueryString, $options: "i" } },
            { uploadedBy: { $regex: searchQueryString, $options: "i" } },
          ],
        },
      });
    }
    // gods
    if (godIds) {
      for (const godId of godIds) {
        aggregateQuery.push({ $match: { "playerData.civ": godId } });
      }
    }

    // maps
    if (mapNames) {
      for (const mapName of mapNames) {
        aggregateQuery.push({ $match: { gameMapName: mapName } });
      }
    }

    // build num
    if (buildNumbers) {
      for (const buildNumber of buildNumbers) {
        aggregateQuery.push({ $match: { buildNumber } });
      }
    }
  }
  aggregateQuery.push(
    { $sort: { createdAt: -1 } },
    { $skip: offset },
    { $limit: PAGE_SIZE }
  );
  return aggregateQuery;
}

export async function listBuildNumbers(): Promise<number[]> {
  await getMongoClient();
  try {
    const buildNumbers = await RecordedGameModel.find()
      .distinct("buildNumber")
      .lean();
    return buildNumbers.sort((a, b) => b - a);
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch build numbers: " + err);
  }
}

export async function incrementDownloadCount(gameGuid: string): Promise<void> {
  await getMongoClient();
  try {
    await RecordedGameModel.updateOne(
      { gameGuid },
      { $inc: { downloadCount: 1 } }
    );
  } catch (err) {
    console.error(err);
    throw new Error("Failed to increment download count: " + err);
  }
}
