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
        hostname: "adteqwnkqoxbzkxyfzkq.supabase.co",
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
