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
      const allNewRatings: any = [];

      matches.forEach((match) => {
        const matchHistoryMapData = match.matchHistoryMap;
        // Convert matchHistoryMapData into an array of arrays
        const arrayOfArrays = Array.from(matchHistoryMapData).map(
          ([key, value]) => [key, ...value]
        );

        // Find the profile data for the given profileId
        const profileData = arrayOfArrays.find(
          (arr) => Number(arr[0]) === profileId
        );

        // If profile data exists, push the newRating to the array
        if (profileData) {
          const matchHistoryEntry = profileData[1] as MatchHistoryMember; // Type assertion if needed
          allNewRatings.push(matchHistoryEntry.newrating); // Collecting newRating
        }
      });

      console.log(allNewRatings);
    } else {
      console.log(`No data found for profile ID: ${profileId}`);
    }

    return Response.json({ Message: "Hi" });
  } catch (error) {
    console.error("Error fetching matches:", error);
    return Response.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
