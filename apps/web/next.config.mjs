import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  webpack: (config) => {
    // Use compiled dist files for workspace packages instead of transpiling source
    config.resolve.alias = {
      ...config.resolve.alias,
      "@pen-paper-rpg/schemas": path.resolve(__dirname, "../../packages/schemas/dist"),
      "@pen-paper-rpg/engine": path.resolve(__dirname, "../../packages/engine/dist"),
      "@pen-paper-rpg/catalog": path.resolve(__dirname, "../../packages/catalog/dist"),
    };
    return config;
  },
};

export default nextConfig;
