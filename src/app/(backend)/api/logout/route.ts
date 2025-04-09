import { NextResponse } from "next/server";
import { deleteCookiesFromServerSide } from "@/utils/cookies";
import { errorResponse, successResponse } from "@/utils/response.decorator";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

export async function POST() {
  try {
    // Create a base response
    const res: any = NextResponse.json(
      successResponse({}, "User logged out successfully")
    );

    // Remove the cookies related to the session
    await deleteCookiesFromServerSide("session_accessToken", res);
    await deleteCookiesFromServerSide("session_refreshToken", res);
    await deleteCookiesFromServerSide("user", res);

    return res;
  } catch (error: any) {
    console.error("Error during user logout:", error);
    return errorResponse("Failed to log out user", 500);
  }
}
