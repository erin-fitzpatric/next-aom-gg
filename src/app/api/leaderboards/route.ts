import { MongoSort } from "@/types/MongoSort";
import { getMythLeaderboard, IGetMythLeaderboard } from "./service";
export const GET = async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const params: IGetMythLeaderboard = {
      searchQuery: (searchParams.get("searchQuery") as string) || "",
      skip: parseInt(searchParams.get("skip") as string),
      limit: parseInt(searchParams.get("limit") as string),
      sort: JSON.parse(searchParams.get("sort") as string) as MongoSort,
    };

    const leaderboardData = await getMythLeaderboard(params);
    return Response.json(leaderboardData);
  } catch (error: any) {
    return Response.json(
      { error: "Error fetching myth data" },
      { status: 500 }
    );
  }
};