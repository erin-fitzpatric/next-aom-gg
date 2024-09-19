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
    await RecordedGameModel.findByIdAndUpdate(gameGuid, {
      gameTitle: gameTitle,
    });
  } catch (error) {
    console.error("Error editing game title:", error);
  }
}
