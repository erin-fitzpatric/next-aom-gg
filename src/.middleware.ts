// Not using middleware right now because edge handlers don't support mongo. There's probably a work around, just dont' have time to figure it out right now.

import { NextRequest } from "next/server"
import { auth } from "./auth"
 
// Use only one of the two middleware options below
// 1. Use middleware directly
// export const { auth: middleware } = NextAuth(authConfig)
 
// 2. Wrapped middleware option
export default auth(async function middleware(_req: NextRequest) {
  // Your custom middleware logic goes here
})