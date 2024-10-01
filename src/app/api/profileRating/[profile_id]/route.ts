import { MatchModel } from "@/db/mongo/model/MatchModel";
import getMongoClient from "@/db/mongo/mongo-client";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const pathSegments = url.pathname.split("/");
  const profileId = Number(pathSegments[pathSegments.length - 1]);
  await getMongoClient();

  try {
    const matches = await MatchModel.find({
      gameMode: "1V1_SUPREMACY",
      [`matchHistoryMap.${profileId}`]: { $exists: true },
    });

    if (matches.length > 0) {
      const allNewRatings: number[] = [];
      matches.forEach((match) => {
        const matchHistoryMapData = match.matchHistoryMap;

        if (matchHistoryMapData instanceof Map) {
          matchHistoryMapData.forEach((matchHistoryEntries, key) => {
            if (Number(key) === profileId) {
              matchHistoryEntries.forEach((entry: any) => {
                allNewRatings.push(entry.newrating);
              });
            }
          });
        } else {
          throw new Error("Invalid matchHistoryMapData format");
        }
      });
      return Response.json(allNewRatings);
    } else {
      throw new Error(`No data found for profile ID: ${profileId}`);
    }
  } catch (error: any) {
    console.error("Error fetching matches:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
