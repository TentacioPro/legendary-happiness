/** @type {import('next').NextConfig} */
// We no longer need the 'isProd' variable
// const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    // The 'path' property was also hardcoded and needs to be removed
    // to use the correct default path.
    domains: ["localhost"], // This is fine, though likely not used in production
    loader: "default",
    minimumCacheTTL: 60,
    formats: ["image/webp"],
  },
  
  // --- THESE ARE THE KEY FIXES ---
  // Set them to the root directory
  basePath: "",
  assetPrefix: "",
  
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

  // --- REMOVED REDUNDANT/INCORRECT CONFIGS ---
  // The 'publicRuntimeConfig' and 'env' blocks were
  // also adding the incorrect paths and are not needed.
  
  trailingSlash: true,
  experimental: {
    optimizePackageImports: ['lucide-react']
  }
};

module.exports = nextConfig;
