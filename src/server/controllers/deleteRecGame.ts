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
    const deleteGame = await RecordedGameModel.findOneAndDelete({ gameGuid });
    
    if (!deleteGame) {
      throw new Error(`Game with gameGuid ${gameGuid} not found.`);
}
  } catch (error) {
    console.error("Error deleting rec game:", error);
    throw error;
  }
}
