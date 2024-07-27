import uploadRec from "@/server/controllers/upload-rec-controller";
import { Errors } from "@/utils/errors";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const userName = formData.get("userName") as string;
    const file = formData.get("file") as File;
    const gameTitle = formData.get("gameTitle") as string;

    console.log("uploading rec");
    const gameData = await uploadRec({ userName, file, gameTitle });
    return Response.json({ gameData });
  } catch (error: any) {
    if (error.message === Errors.UNIQUE_KEY_VIOLATION) {
      return Response.json({ error: Errors.UNIQUE_KEY_VIOLATION }, { status: 400 });
    } else if (error.message = Errors.UNSUPPORTED_GAME_SIZE) {
      return Response.json({ error: Errors.UNSUPPORTED_GAME_SIZE }, { status: 400 });
    }
    else {
      console.error("Error uploading rec", error);
      return Response.json({ error: "Error uploading rec" }, { status: 500 });
    }
  }
}
