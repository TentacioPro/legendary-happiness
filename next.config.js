/** @type {import('next').NextConfig} */
// We no longer need the 'isProd' variable

const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    // The 'path' property was also hardcoded and needs to be removed
    // to use the correct default path.
    domains: ["localhost"],
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

  // --- REDUNDANT/INCORRECT CONFIGS REMOVED ---
  // The 'publicRuntimeConfig' and 'env' blocks were
  // also adding incorrect paths and are not needed.
  
  trailingSlash: true,
  experimental: {
    optimizePackageImports: ['lucide-react']
  }
};

module.exports = nextConfig;
