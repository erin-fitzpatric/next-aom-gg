import { MatchModel } from "@/db/mongo/model/MatchModel";
import getMongoClient from "@/db/mongo/mongo-client";
import { MatchHistoryMember } from "@/types/MatchHistory";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const pathSegments = url.pathname.split("/");
  const profileId = Number(pathSegments[pathSegments.length - 1]);
  await getMongoClient();

  console.log("Profile ID:", profileId);

  try {
    const matches = await MatchModel.find({
      gameMode: "1V1_SUPREMACY",
      [`matchHistoryMap.${profileId}`]: { $exists: true },
    });

    if (matches.length > 0) {
      const matchHistoryMapData = matches[0].matchHistoryMap;
      const arrayOfArrays = Array.from(matchHistoryMapData).map(
        ([key, value]) => [key, ...value]
      );
      const profileData = arrayOfArrays.find(
        (arr) => Number(arr[0]) === profileId
      );
      console.log(profileData);
      if (profileData) {
        const matchHistoryEntry = profileData[1] as MatchHistoryMember;
        const oldRating1 = matchHistoryEntry.oldrating;
        const newRating1 = matchHistoryEntry.newrating;
        console.log(`Old Rating: ${oldRating1}`);
        console.log(`New Rating: ${newRating1}`);
      } else {
        console.log(`No data found for profile ID: ${profileId}`);
      }
    } else {
      console.log("No matches found.");
    }
    return Response.json({ Message: "Hi" });
  } catch (error) {
    console.error("Error fetching matches:", error);
    return Response.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
