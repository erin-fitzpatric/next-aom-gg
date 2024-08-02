"use server"
import { signIn } from "@/auth";

export default async function socialAuth(platform: string) {
  const result = await signIn(platform);
  // save user session to mongodb

  return result;
}

