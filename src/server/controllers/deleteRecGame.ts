import RecordedGameModel from "@/db/mongo/model/RecordedGameModel";
import getMongoClient from "@/db/mongo/mongo-client";

export type deleteRecGameParams = {
  gameGuid: string;
};

export default async function deleteRecGame(
  params: deleteRecGameParams
): Promise<void> {
  const gameGuid = params;
  await getMongoClient();
  try {
    const existingGame = await RecordedGameModel.findOne({ gameGuid });
    if (!existingGame) {
      throw new Error(`Game with gameGuid ${gameGuid} not found.`);
    }
    await existingGame.deleteOne();
  } catch (error) {
    console.error("Error deleting rec game:", error);
    throw error;
  }
}
