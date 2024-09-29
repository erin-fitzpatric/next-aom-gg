import { fetchMatchupData } from "@/server/services/fetchMatchupData.service";

export interface GetMatchupDataParams {
  eloRange?: string;
  startDate?: string;
  endDate?: string;
  godId?: number;
}

export async function getMatchupData(params: GetMatchupDataParams) {
  return await fetchMatchupData(params);
}