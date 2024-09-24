import { SocialsModel } from "@/db/mongo/model/SocialsModel";
import getMongoClient from "@/db/mongo/mongo-client";

type Params = {
    userId: string;
};

export default async function twitchLive(params: Params): Promise<any> {
    const { userId } = params; 
    await getMongoClient();
    try {
        const twitchName = await SocialsModel.findOne({ userId });
        return twitchName;
    } catch (err) {
        console.error("Error fetching Twitch name:", err);
        throw new Error("Failed to fetch Twitch name.");
    }
}
