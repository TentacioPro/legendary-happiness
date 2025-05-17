/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    domains: ["localhost"],
    path: "/_next/image/",
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
};

module.exports = nextConfig;
