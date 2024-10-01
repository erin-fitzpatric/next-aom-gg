import { BuildModel } from "@/db/mongo/model/BuildNumber";
import getMongoClient from "@/db/mongo/mongo-client";

export async function getPatchDates(patchDescription: string) {
  await getMongoClient();
  const builds = await BuildModel.find().sort({ releaseDate: 1 });
  const patchIndex = builds.findIndex(
    (build) => build.description === patchDescription
  );

  if (patchIndex === -1) {
    throw new Error("Patch description not found");
  }

  const startDate = builds[patchIndex].releaseDate;
  const endDate =
    patchIndex < builds.length - 1
      ? builds[patchIndex + 1].releaseDate
      : new Date();

  return { startDate, endDate };
}