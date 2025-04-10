/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DEFAULT_PASSWORD: process.env.DEFAULT_PASSWORD,
    POSTGRESQL_CONNECTION_STRING: process.env.POSTGRESQL_CONNECTION_STRING,
    JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
    NEXT_PUBLIC_ACCESS_TOKEN_TIME: process.env.NEXT_PUBLIC_ACCESS_TOKEN_TIME,
    NEXT_PUBLIC_REFRESH_TOKEN_TIME: process.env.NEXT_PUBLIC_REFRESH_TOKEN_TIME,
    NEXT_PUBLIC_REACT_APP_BASE_URL: process.env.NEXT_PUBLIC_REACT_APP_BASE_URL,
    NEXT_PUBLIC_S3_IMAGES_URL: process.env.NEXT_PUBLIC_S3_IMAGES_URL,
    SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
    ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
    REGION: process.env.REGION,
    BUCKET: process.env.BUCKET,
    S3_END_POINT: process.env.S3_END_POINT,
  },

  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
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
