"use server";

import RecordedGameModel from "@/db/mongo/model/RecordedGameModel";
import getMongoClient from "@/db/mongo/mongo-client";
import { Filters } from "@/types/Filters";
import { IRecordedGame } from "@/types/RecordedGame";
import { PipelineStage } from "mongoose";

export interface QueryOptions {
  sort?: { [key: string]: 1 | -1 };
  limit?: number;
}

export async function queryMythRecs(
  pageIndex: number,
  filters?: Filters,
  queryOptions?: QueryOptions,
): Promise<IRecordedGame[]> {
  // Set a default page size or use limit from queryOptions if provided
  const PAGE_SIZE = queryOptions?.limit ?? 16;
  const offset = pageIndex * PAGE_SIZE;
  await getMongoClient();
  let result;

  try {
    const aggregateQuery = buildFilterQuery(offset, PAGE_SIZE, filters);

    if (queryOptions?.sort) {
      const sortQuery = buildSortQuery(queryOptions.sort);
      sortQuery && aggregateQuery.push(sortQuery);
    }

    // Match rec with user data
    aggregateQuery.push({
      $lookup: {
        from: "users",
        let: { uploadedByUserId: { $toObjectId: "$uploadedByUserId" } },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$uploadedByUserId"],
              },
            },
          },
        ],
        as: "userData",
      },
    });

    aggregateQuery.push({
      $unwind: {
        path: "$userData",
        preserveNullAndEmptyArrays: true,
      },
    });

    // Remove _id from all data so the frontend doesn't complain...could stringify if needed later
    aggregateQuery.push({
      $project: {
        _id: 0,
        "userData._id": 0,
        "playerData._id": 0,
      },
    });

    result = await RecordedGameModel.aggregate(aggregateQuery).exec();

    result.map((rec) => {
      rec.uploadedBy = rec?.userData?.name ?? rec?.uploadedBy ?? "Unknown";
    });

    return result;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch Myth recordings: " + err);
  }
}
function buildFilterQuery(
  offset: number,
  PAGE_SIZE: number,
  filters?: Filters,
): PipelineStage[] {
  const aggregateQuery = <PipelineStage[]>[];
  if (filters) {
    // TODO -we will refactor this later...right???
    // This could be rewritten to use one $match stage with a single object
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
            { gameGuid: { $regex: searchQueryString, $options: "i" } },
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
    { $limit: PAGE_SIZE },
  );
  return aggregateQuery;
}

function buildSortQuery(sort?: {
  [key: string]: 1 | -1;
}): PipelineStage | undefined {
  if (!sort) {
    return undefined; // Return nothing if there is no sort params
  }

  const formattedSort: { [key: string]: 1 | -1 } = {};
  Object.keys(sort).forEach((key) => {
    formattedSort[key] = sort[key];
  });

  return { $sort: formattedSort };
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
      { $inc: { downloadCount: 1 } },
    );
  } catch (err) {
    console.error(err);
    throw new Error("Failed to increment download count: " + err);
  }
}
