import {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
} from "@/utils/constant";
import { SignJWT, jwtVerify, JWTPayload } from "jose";

class JWTService {
  // Sign access token
  static async signAccessToken(payload: JWTPayload, expiryTime: string) {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(expiryTime)
      .sign(new TextEncoder().encode(JWT_ACCESS_TOKEN_SECRET));
  }

  // Sign refresh token
  static async signRefreshToken(payload: JWTPayload, expiryTime: string) {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(expiryTime)
      .sign(new TextEncoder().encode(JWT_REFRESH_TOKEN_SECRET));
  }

  // Verify access token
  static async verifyAccessToken(token: string): Promise<JWTPayload | null> {
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(JWT_ACCESS_TOKEN_SECRET)
      );
      return payload;
    } catch (error) {
      return null;
    }
  }

  // Verify refresh token
  async verifyRefreshToken(token: string): Promise<JWTPayload | null> {
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(JWT_REFRESH_TOKEN_SECRET)
      );
      return payload;
    } catch (error) {
      return null;
    }
  }
}

export default JWTService;
