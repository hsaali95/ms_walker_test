import Users from "@/db/models/user";
import { errorResponse, successResponse } from "@/utils/response.decorator";
import { verifyPassword } from "@/utils/helper"; // Ensure you have a password verification helper
import JWTService from "@/services/jwt/jwt-services";
import { setCookie } from "@/utils/cookies";
import { ACCESS_TOKEN_TIME, REFRESH_TOKEN_TIME } from "@/utils/constant";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

// Handle POST requests for user login
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    // Basic validation
    if (!email || !password) {
      return errorResponse("Missing required fields: email or password", 400);
    }

    // Check if the email exists
    const existingUser = await Users.findOne({
      where: { email },
      attributes: {
        exclude: ["created_at", "updated_at", "deleted_at", "deleted_by"],
      },
    });
    if (!existingUser) {
      return errorResponse("Invalid email or password", 401);
    }

    // Verify the password
    const isPasswordValid = await verifyPassword(
      password,
      existingUser.password || ""
    );
    if (!isPasswordValid) {
      return errorResponse("Invalid email or password", 401);
    }

    // Prepare user response without password
    const userResponse = existingUser.get({ plain: true });
    delete (userResponse as any).password;
    let accessToken: any;
    let refreshToken: any;
    if (!existingUser.is_new) {
      console.log("****************Login******************", ACCESS_TOKEN_TIME);
      // Generate tokens
      accessToken = await JWTService.signAccessToken(
        { id: userResponse.id, role_id: userResponse?.role_id },
        ACCESS_TOKEN_TIME || ""
        // "12h"
      );
      console.log("****************Login******************", ACCESS_TOKEN_TIME);
      refreshToken = await JWTService.signRefreshToken(
        { id: userResponse.id },
        REFRESH_TOKEN_TIME || ""
      );
    }
    if (![1, 2, 3, 7].includes(userResponse.role_id)) {
      return errorResponse("You are not allowed to login", 401);
    }
    // Set tokens in cookies
    const tokens: any = {
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: userResponse,
    };

    const res = successResponse(
      {
        ...userResponse,
        tokens,
      },
      !existingUser.is_new
        ? "User logged in successfully"
        : "Please reset your password before logging in."
    );

    return await setCookie("session", tokens, res);
  } catch (error: any) {
    console.error("Error during user login:", error);
    return errorResponse("Failed to log in user", 500);
  }
}
