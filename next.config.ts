import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel handles output automatically. Standalone gives smaller deployments
  // and faster cold starts on Vercel too.
  output: "standalone",
  reactStrictMode: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
