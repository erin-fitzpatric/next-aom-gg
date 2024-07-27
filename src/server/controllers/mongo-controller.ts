'use server';
import { Filters } from "@/types/Filters";
import { queryMythRecs } from "../services/mongo-service";
import { IRecordedGame } from "@/types/RecordedGame";

export async function getMythRecs(page: number, filters?: Filters): Promise<IRecordedGame[]> {
  const result = await queryMythRecs(page, filters);
  return result;
}
