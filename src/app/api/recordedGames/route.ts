import uploadRec from "@/server/controllers/upload-rec-controller";

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
    if (error.message === "Unique key violation") {
      return Response.json({ error: "Rec already uploaded" }, { status: 400 });
    } else {
      console.error("Error uploading rec", error);
      return Response.json({ error: "Error uploading rec" }, { status: 500 });
    }
  }
}
