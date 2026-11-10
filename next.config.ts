import type { NextConfig } from "next";

// OpenNext needs the standalone server output, which includes
// `.next/standalone` and the server manifests it packages into the Worker.
// Netlify still builds the static `out` directory from the same source while
// the Cloudflare migration is being verified, so keep that path for Netlify's
// own build environment only. Every other build, including Cloudflare Workers
// Builds and local builds, produces standalone output.
const isNetlifyBuild = process.env.NETLIFY === "true";

const nextConfig: NextConfig = {
  // The site is fully static: no server actions, route handlers that need a
  // server, or runtime data. OpenNext still requires the standalone server
  // output, not the static export directory.
  output: isNetlifyBuild ? "export" : "standalone",
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
