import uploadRec from "@/server/controllers/upload-rec-controller"; // New controller for chunk upload
import { Errors } from "@/utils/errors";
import { auth } from "@/auth";

export const POST = async function POST(request: Request) {
  try {
    // Check if user is authenticated
    const session = await auth();
    if (!session?.user?.id)
      return Response.json({ error: "Not authenticated" }, { status: 401 });

    const formData = await request.formData();
    const userId = session.user.id;

    // Extract file metadata from the request
    const file = formData.get("file") as File;
    const gameTitle = formData.get("gameTitle") as string;
    const chunkNumber = formData.get("chunkNumber") as string; // Handle chunk number
    const totalChunks = formData.get("totalChunks") as string; // Handle total chunk count

    console.log("Uploading chunk number", chunkNumber, "of", totalChunks);

    // Pass the chunk to the chunk upload controller
    await uploadRec({
      userId,
      file,
      gameTitle,
      chunkNumber: parseInt(chunkNumber),
      totalChunks: parseInt(totalChunks),
    });

    return Response.json({ status: 200 });
  } catch (error: any) {
    if (error.message === Errors.UNIQUE_KEY_VIOLATION) {
      return Response.json(
        { error: Errors.UNIQUE_KEY_VIOLATION },
        { status: 400 }
      );
    } else if (error.message === Errors.UNSUPPORTED_GAME_SIZE) {
      return Response.json(
        { error: Errors.UNSUPPORTED_GAME_SIZE },
        { status: 400 }
      );
    } else {
      console.error("Error uploading rec chunk", error);
      return Response.json(
        { error: "Error uploading rec chunk" },
        { status: 500 }
      );
    }
  }
};
