import Users from "@/db/models/user";
import { errorResponse, successResponse } from "@/utils/response.decorator";
import { hashPassword } from "@/utils/helper";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

// Handle POST requests for user creation
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, role_id } = body;

    // Basic validation
    if (!email || !password || !role_id || !name) {
      return errorResponse(
        "Missing required fields: email, password, name, or role_id",
        400
      );
    }

    // Check if the email already exists
    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      return errorResponse("Email already in use", 400);
    }

    // Hash the password before saving
    const hashedPassword = await hashPassword(password);

    // Create a new user
    const newUser = await Users.create({
      email,
      password: hashedPassword,
      name,
      role_id,
    });

    // Prepare user response without password
    const userResponse = newUser.get({ plain: true });
    delete (userResponse as any).password;

    return successResponse(userResponse, "User created successfully");
  } catch (error: any) {
    console.error("Error creating user:", error);
    return errorResponse("Failed to create user", 500);
  }
}
