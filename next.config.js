/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Ensure Next.js supports socket.io and API routes properly on Render
  experimental: {
    serverActions: {
      allowedOrigins: ["*"]
    }
  },

  // Allow API routes like /api/socket, /api/auth, etc.
  async rewrites() {
    return [
      {
        source: "/socket.io/:path*",
        destination: "/api/socket/:path*"
      }
    ];
  },

  // Optimization for production on Render
  output: "standalone",

  // Enable CORS headers for real-time connections
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" }
        ]
      }
    ];
  }
};

module.exports = nextConfig;

