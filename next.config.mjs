/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: "i.ytimg.com",
      },
    ],
  },
};

export default nextConfig;
