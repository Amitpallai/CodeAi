/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Add support for importing SVG files
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // Add support for importing markdown files
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });

    // Fix for react-syntax-highlighter
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }

    return config;
  },
  // Add any domains you're loading images from
  images: {
    domains: ['img.clerk.com', 'images.clerk.dev'],
  },
  // Enable experimental features if needed
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig 