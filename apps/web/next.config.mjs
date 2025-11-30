import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx',
  latex: true,
  defaultShowCopyCode: true,
  // Performance optimizations
  flexsearch: {
    codeblocks: false // Disable code block indexing for faster builds
  },
  codeHighlight: true,
})

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
  
  // Performance optimizations
  swcMinify: true,
  reactStrictMode: true,
  poweredByHeader: false,
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  experimental: {
    optimizePackageImports: ['lucide-react', 'nextra', 'nextra-theme-docs'],
    optimizeCss: true,
    webpackBuildWorker: true, // Faster builds
  },
  
  // Reduce bundle size
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
    },
  },

  // Security Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self'",
              "frame-ancestors 'self'"
            ].join('; ')
          }
        ],
      },
    ];
  }
};

export default withNextra(nextConfig);
