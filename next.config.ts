import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdf-parse (via pdfjs-dist) loads a worker file from disk at runtime;
  // bundling it breaks that resolution, so let Node require it natively.
  serverExternalPackages: ["pdf-parse", "pdfjs-dist"],
};

export default nextConfig;
