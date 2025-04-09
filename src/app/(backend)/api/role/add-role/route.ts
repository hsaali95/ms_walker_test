import Role from "@/db/models/role";
import { errorResponse, successResponse } from "@/utils/response.decorator";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate the request body
    if (!body || typeof body.name !== "string" || body.name.trim() === "") {
      return errorResponse("Missing or invalid 'name' field", 400);
    }

    // Create a new role
    const newRole = await Role.create({
      name: body.name.trim(),
    });

    // Format the response to exclude sensitive or unnecessary fields
    const roleResponse = newRole.get({ plain: true });

    return successResponse(
      {
        role: roleResponse,
      },
      "Role created successfully"
    );
  } catch (error: any) {
    console.error("Error creating role:", error);
    return errorResponse(
      error.message || "Failed to create role",
      500
    );
  }
}
