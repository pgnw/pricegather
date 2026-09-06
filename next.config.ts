import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  serverExternalPackages: [
    "patchright",
    "patchright-core",
    "chromium-bidi",
  ],
};

export default nextConfig;
