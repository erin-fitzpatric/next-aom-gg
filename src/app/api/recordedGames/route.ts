import uploadRec from "@/server/controllers/upload-rec-controller";
import { Errors } from "@/utils/errors";
import { auth } from "@/auth";
import editGameTitle from "@/server/controllers/editGameTitle";
import deleteRecGame from "@/server/controllers/deleteRecGame";

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
        { status: 400 }
      );
    }

    console.log("uploading rec");
    await uploadRec({ userId, s3Key, gameTitle });
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
      console.error("Error uploading rec", error);
      return Response.json({ error: "Error uploading rec" }, { status: 500 });
    }
  }
};

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json(
        {
          error: "Not authenticated",
        },
        { status: 401 }
      );
    }
    const userId = session.user.id;
    const body = await request.json();
    const { gameTitle, gameGuid } = body;

    if (!gameGuid) {
      return Response.json({ error: "Missing gameGuid" }, { status: 400 });
    }
    await editGameTitle({ gameTitle, gameGuid });
    return Response.json(
      { message: "Game title updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error editing game title:", error);

    if (error.message.includes("not found")) {
      return Response.json({ error: error.message }, { status: 404 });
    }

    return Response.json(
      { error: "Error editing game title" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json(
        {
          error: "Not authenticated",
        },
        { status: 401 }
      );
    }
    const userId = session.user.id;
    const body = await request.json();
    const { gameGuid } = body;

    if (!gameGuid) {
      return Response.json({ error: "Missing gameGuid" }, { status: 400 });
    }
    await deleteRecGame(gameGuid);
    return Response.json(
      { message: "Rec game deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting rec game:", error);

    if (error.message.includes("not found")) {
      return Response.json({ error: error.message }, { status: 404 });
    }

    return Response.json({ error: "Error deleting rec game" }, { status: 500 });
  }
}
