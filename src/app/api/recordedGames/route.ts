import uploadRec from "@/server/controllers/upload-rec-controller";
import { Errors } from "@/utils/errors";
import { auth } from "@/auth";

export const POST = async function POST(request: Request) {
  try {
    // Check if user is authenticated - move this to middleware later
    const session = await auth();
    if (!session?.user?.id)
      return Response.json({ error: "Not authenticated" }, { status: 401 });

    const body = await request.json();
    const userId = session.user.id;
    const { s3Key, gameTitle } = body;

    if (!s3Key) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    console.log("uploading rec");
    await uploadRec({ userId, s3Key, gameTitle });
    return Response.json({ status: 200 });
  } catch (error: any) {
    if (error.message === Errors.UNIQUE_KEY_VIOLATION) {
      return Response.json(
        { error: Errors.UNIQUE_KEY_VIOLATION },
        { status: 400 },
      );
    } else if (error.message === Errors.UNSUPPORTED_GAME_SIZE) {
      return Response.json(
        { error: Errors.UNSUPPORTED_GAME_SIZE },
        { status: 400 },
      );
    } else {
      console.error("Error uploading rec", error);
      return Response.json({ error: "Error uploading rec" }, { status: 500 });
    }
  }
};
