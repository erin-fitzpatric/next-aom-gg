import { listBuilds } from "./service";

export const GET = async function GET(req: Request) {
  try {
    const builds = await listBuilds();
    return new Response(JSON.stringify(builds), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=43200, stale-while-revalidate=43200",
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "Error fetching builds" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
