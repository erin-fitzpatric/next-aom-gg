import { createClient } from "redis";

const { REDIS_CLIENT_PASSWORD, REDIS_HOST, REDIS_PORT } = process.env;
if (!REDIS_CLIENT_PASSWORD || !REDIS_HOST || !REDIS_PORT) {
  throw new Error("Missing required environment variables for Redis client");
}
const client = createClient({
  password: process.env.REDIS_CLIENT_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(REDIS_PORT),
  },
});

export default function getRedisClient() {
  return client;
}
