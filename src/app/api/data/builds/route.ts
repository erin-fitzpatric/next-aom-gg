import { BuildModel } from "@/db/mongo/model/BuildNumber";
import getMongoClient from "@/db/mongo/mongo-client";

export const GET = async function GET(req: Request) {
  try {
    await getMongoClient();
    const builds = await BuildModel.find({}, "description");
    const buildDescriptions = builds.map((build) => build.description);

    return new Response(JSON.stringify(buildDescriptions), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=86400",
      },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: "Error fetching build descriptions" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
