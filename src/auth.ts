import NextAuth from "next-auth";
// import Discord from "next-auth/providers/discord";
// import Twitch from "next-auth/providers/twitch";
import Steam from "steam-next-auth";
import Xbox from "./server/providers/xbox";

import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { MongoClient } from "mongodb";

const mongoClient = new MongoClient(process.env.MONGODB_URI as string, {});

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth((req) => {
  return {
    adapter: MongoDBAdapter(mongoClient),
    providers: [
      // Discord,
      // Twitch,
      Xbox,
      ...(req
        ? [
            Steam(req, {
              clientSecret: process.env.AUTH_STEAM_KEY!,
              callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/openid`,
            }),
          ]
        : []),
    ],callbacks: {
    async session({session}) {
        return session
      }
    }
  };
});
