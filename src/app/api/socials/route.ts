import SocialsLink from "@/server/controllers/socials-controller";

export async function POST(request: Request) {
    const body = await request.json();
    const { userId, twitchUrl } = body;
    try {
        await SocialsLink({ userId, twitchUrl });
        return Response.json({ message: "Social added successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error adding socials:", error);
        return Response.json(
            { error: "Error adding socials" },
            { status: 500 }
        );
    }
}
