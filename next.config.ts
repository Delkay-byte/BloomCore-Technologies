import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The site is fully static: no server actions, route handlers that need a
  // server, or runtime data. Export produces an "out" directory for Netlify.
  output: "export",
  images: { unoptimized: true },
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
