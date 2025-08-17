import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'yf4gntnbiojqy0w2.public.blob.vercel-storage.com',
      },
    ],
  },
};

export default nextConfig;
