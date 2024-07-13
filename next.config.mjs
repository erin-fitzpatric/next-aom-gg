import bodyParser from "body-parser";
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // have to allow all hosts for images to work with the remote patterns
    remotePatterns: [
      {
        hostname: "*",
      },
    ],
  },
  async serverMiddleware() {
    return [
      bodyParser.json({ limit: "15mb" }),
      bodyParser.urlencoded({ limit: "15mb", extended: true }),
    ];
  },
};

export default nextConfig;
