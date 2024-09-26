import RecordedGameModel from "@/db/mongo/model/RecordedGameModel";
import getMongoClient from "@/db/mongo/mongo-client";

export type editGameTitleParams = {
  gameTitle: string;
  gameGuid: string;
};

export default async function editGameTitle(
  params: editGameTitleParams
): Promise<void> {
  const { gameGuid, gameTitle } = params;

  await getMongoClient();
  try {
    const result = await RecordedGameModel.updateOne({ gameGuid },{ $set: { gameTitle } });
    if (result.matchedCount === 0) {
      throw new Error(`Game with gameGuid ${gameGuid} not found.`);
    }
  } catch (error) {
    console.error("Error editing game title:", error);
    throw error;
  }
}
