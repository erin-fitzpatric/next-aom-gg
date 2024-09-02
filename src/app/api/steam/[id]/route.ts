import { fetchSteamProfile } from "./service";

export const GET = async function GET(req: Request) {
  try {
    // Extract the `id` from the URL path
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    // Fetch the Steam profile using the `id`
    const leaderboardData = await fetchSteamProfile(id as string);
    
    // Return the fetched data
    return new Response(JSON.stringify(leaderboardData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: "Error fetching steam profile" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
