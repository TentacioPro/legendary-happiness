/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    domains: ["localhost"],
    path: "/legendary-happiness/_next/image/",
    loader: "default",
    minimumCacheTTL: 60,
    formats: ["image/webp"],
  },
  basePath: isProd ? "/legendary-happiness" : "",
  assetPrefix: isProd ? "/legendary-happiness/" : "",
  staticPageGenerationTimeout: 60,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
  publicRuntimeConfig: {
    basePath: isProd ? "/legendary-happiness" : "",
    assetPrefix: isProd ? "/legendary-happiness/" : "",
  },
  env: {
    BASE_PATH: isProd ? "/legendary-happiness" : "",
    ASSET_PREFIX: isProd ? "/legendary-happiness/" : "",
  },
  trailingSlash: true,
  // For static export with App Router
  static: true,
  // Add proper export path map for App Router
  exportPathMap: async () => {
    return {
      '/': { page: '/' }
    };
  }
};

module.exports = nextConfig;
