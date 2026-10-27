import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // SKIP_TYPECHECK=1 npm run build skips the type-check step on low-memory servers
  // (run `npx tsc --noEmit` somewhere else instead).
  typescript: { ignoreBuildErrors: process.env.SKIP_TYPECHECK === "1" },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
