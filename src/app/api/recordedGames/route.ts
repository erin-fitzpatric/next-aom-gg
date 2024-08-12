import uploadRec from "@/server/controllers/upload-rec-controller";
import { Errors } from "@/utils/errors";
import { auth } from "@/auth";

export const POST = async function POST(request: Request) {
  try {
    // Check if user is authenticated - move this to middleware later
    const sesssion = await auth();
    if (!sesssion?.user?.id) return Response.json({ error: "Not authenticated" }, { status: 401 });

    const formData = await request.formData();
    const userId = sesssion.user.id;
    const file = formData.get("file") as File;
    const gameTitle = formData.get("gameTitle") as string;

    console.log("uploading rec");
    const gameData = await uploadRec({ userId, file, gameTitle });
    return Response.json({ gameData });
  } catch (error: any) {
    if (error.message === Errors.UNIQUE_KEY_VIOLATION) {
      return Response.json({ error: Errors.UNIQUE_KEY_VIOLATION }, { status: 400 });
    } else if (error.message === Errors.UNSUPPORTED_GAME_SIZE) {
      return Response.json({ error: Errors.UNSUPPORTED_GAME_SIZE }, { status: 400 });
    }
    else {
      console.error("Error uploading rec", error);
      return Response.json({ error: "Error uploading rec" }, { status: 500 });
    }
  }
};
