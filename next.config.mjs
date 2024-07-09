/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "a.thumbs.redditmedia.com",
      },
      {
        protocol: "https",
        hostname: "b.thumbs.redditmedia.com",
      },
      {
        protocol: "https",
        hostname: "i.redd.it",
      },
    ],
  },
};

export default nextConfig;
