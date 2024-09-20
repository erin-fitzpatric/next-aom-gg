import { BuildModel } from "@/db/mongo/model/BuildNumber";
import getMongoClient from "@/db/mongo/mongo-client";
import { Build } from "@/types/Build";

export async function listBuilds(): Promise<Build[]> {
  await getMongoClient();
  const result = await BuildModel.find().sort({ buildNumber: -1 }).lean();
  return result;
}
