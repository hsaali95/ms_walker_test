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
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_REGION: process.env.AWS_REGION,
    AWS_BUCKET: process.env.AWS_BUCKET,
    AWS_END_POINT: process.env.AWS_END_POINT,
  },

  output: "standalone",
  experimental: {
    serverActions: true,
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
