import { MythRecs } from "@/types/MythRecs";
import queryMythRecs from "../services/mongo-service";

// todo - add pagination params
export async function getMythRecs(): Promise<MythRecs[]> {
  return await queryMythRecs();
}
