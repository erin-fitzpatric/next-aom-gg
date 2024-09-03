import { SteamProfile } from "@/types/Steam";

export async function fetchSteamProfile(steamId: string): Promise<SteamProfile> {
  const apiKey = process.env.AUTH_STEAM_KEY;

  const response = await fetch(
    `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Steam profile data");
  }

  const data = await response.json();
  if (!data.response.players || data.response.players.length === 0) {
    throw new Error("No player data found");
  }
  return data.response.players[0] as SteamProfile; // Assumes that only one player is returned
}
