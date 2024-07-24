import { MythRec } from "@/types/MythRecs";
import { queryMythRecs } from "../services/mongo-service";

export async function getMythRecs(page: number): Promise<MythRec[]> {
  const result = await queryMythRecs(page);
  return result;
}
