import uploadRec from "@/server/controllers/upload-rec-controller";

export async function POST(request: Request) {
  const formData = await request.formData();
  const userName = formData.get('userName') as string;
  const file = formData.get('file') as File;

  console.log('uploading rec');
  const gameData = await uploadRec({ userName, file });
  return Response.json({ gameData });
}