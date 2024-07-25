import { queryMythRecs } from "../services/mongo-service";
import { IRecordedGame } from "@/types/RecordedGame";

export async function getMythRecs(page: number): Promise<IRecordedGame[]> {
  const result = await queryMythRecs(page);
  return result;
}
