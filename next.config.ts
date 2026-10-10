import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  allowedDevOrigins: ["169.254.123.100"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // Empêche Next.js de bundler firebase-admin côté client
  serverExternalPackages: ["firebase-admin"],
};

export default nextConfig;
