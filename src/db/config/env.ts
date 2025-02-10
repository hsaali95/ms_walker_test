import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  [key: string]: string;
}
const env: EnvConfig = {
  POSTGRESQL_CONNECTION_STRING: process.env.POSTGRESQL_CONNECTION_STRING || "",
  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET || "",
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET || "",
};
export default env;
