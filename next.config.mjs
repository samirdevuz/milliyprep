/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Reduce barrel-import cost (esp. lucide-react) during dev compilation.
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  // Keep compiled pages warm longer in dev so navigation stays fast after
  // the first (webpack) compile.
  onDemandEntries: {
    maxInactiveAge: 1000 * 60 * 60,
    pagesBufferLength: 8,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
        pathname: "/api/portraits/**",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
