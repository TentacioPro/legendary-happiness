/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: isProd ? "/legendary-happiness" : "",
  assetPrefix: isProd ? "/legendary-happiness/" : "",
  // basePath: "",
  // assetPrefix: "",
};

module.exports = nextConfig;
