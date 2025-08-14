import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for shared hosting
  output: 'export',
  
  // Disable server-side features not supported in static export
  images: {
    unoptimized: true,
  },
  
  // Configure for shared hosting
  trailingSlash: true,
  
  // Base path configuration (if deploying to subdirectory)
  // basePath: '/subfolder', // Uncomment if deploying to subdirectory
  
  // Asset prefix for CDN or subdirectory
  // assetPrefix: '/subfolder', // Uncomment if deploying to subdirectory
  
  // Disable server-side rendering for static export
  experimental: {
    // No experimental features needed for static export
  },
};

export default nextConfig;
