/** @type {import('next').NextConfig} */
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
let apiHost = 'localhost';
try {
  apiHost = new URL(apiUrl).hostname;
} catch {
  // fall back
}

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: apiHost },
      { protocol: 'https', hostname: apiHost },
      { protocol: 'https', hostname: '**' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['@tiptap/react', '@tiptap/starter-kit'],
  },
};

module.exports = nextConfig;
