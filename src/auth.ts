import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import Twitch from "next-auth/providers/twitch";
// TODO - add steam
// TODO - add xbox

// TODO
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { MongoClient } from "mongodb";

const mongoClient = new MongoClient(process.env.MONGODB_URI as string, {});
console.log('doing auth things')
export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(mongoClient),
  providers: [Discord, Twitch],
});
