/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    // have to allow all hosts for images to work with the remote patterns
    remotePatterns: [
      {
        hostname: "*",
      },
    ],
  },
};

export default nextConfig;
