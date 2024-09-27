import { MatchModel } from "@/db/mongo/model/MatchModel";
import getMongoClient from "@/db/mongo/mongo-client";

export const GET = async function GET(req: Request) {
  try {
    await getMongoClient();
    const gameModes = await MatchModel.distinct("gameMode");
    return new Response(JSON.stringify(gameModes), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=86400",
      },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch game modes" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
