// @/app/api/sync-db/route.ts
import sequelize from "@/db/config/config";
import { errorResponse, successResponse } from "@/utils/response.decorator";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

async function initializeDatabase() {
  try {
    // This sync will create or alter tables
    await sequelize.sync({ alter: true });
    console.log("Database synchronized successfully!");
    return successResponse(
      { message: "Database synchronized successfully" },
      "200"
    );
  } catch (error) {
    console.error("Database sync failed:", error);
    return errorResponse("Database sync failed", 500);
  }
}

export async function POST() {
  return initializeDatabase();
}
