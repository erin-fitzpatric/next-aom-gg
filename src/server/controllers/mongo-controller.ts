import { queryMythRecs } from "../services/mongo-service";
import { IRecordedGame } from "@/types/RecordedGame";

// todo - add pagination params
export async function getMythRecs(page: number): Promise<IRecordedGame[]> {
  return await queryMythRecs(page);
}
