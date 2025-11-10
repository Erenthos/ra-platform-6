/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
  // ✅ Always render dynamic pages at runtime
  output: "standalone",
};

module.exports = nextConfig;
