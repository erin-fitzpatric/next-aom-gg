import { SocialsModel } from "@/db/mongo/model/SocialsModel";
import getMongoClient from "@/db/mongo/mongo-client";
import { Socials } from "@/types/Socials";

export default async function SocialsLink(params:Socials): Promise<void> {
    const { userId, twitchUrl } = params;
    await getMongoClient();
    try {
        const result = await SocialsModel.create({ userId, twitchUrl });
        if (result.matchedCount === 0) {
            throw new Error(`Error creating social`);
        }
    } catch (error) {
        console.error("Error editing game title:", error);
        throw error;
    }
}