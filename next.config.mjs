/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["sequelize"],
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mswalker-uploads.s3.us-west-1.amazonaws.com",
        port: "",
        pathname: "/**", // Allow all paths under the domain
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
    }
    return config;
  },
};

export default nextConfig;
