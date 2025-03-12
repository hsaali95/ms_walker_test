import { errorResponse, successResponse } from "@/utils/response.decorator";
import Role from "@/db/models/role";
import Users from "@/db/models/user";
import env from "@/db/config/env";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

type TBody = {
  Id: string;
  UserId: string;
  RoleId: string;
  Email: string;
  UserName: string;
};

// Handle POST requests for user creation
export async function POST(request: Request) {
  try {
    let newUsers = await request.json();

    // const { Id, UserId, RoleId, Email, UserName } = body;
    const roles = await Role.findAll({
      attributes: ["id", "name", "identifier"],
    });

    newUsers = newUsers.map((user: TBody) => ({
      email: user.Email,
      password: env.DEFAULT_PASSWORD,
      name: user.Email.split("@")[0],
      image:
        "./files/survey-images/f083b530-f531-4e6b-8e5c-d6558874fb4a_Vector (11).png",
      role_id: roles.find((role) => role.identifier == user.RoleId)!.id,
      identifier: user.Id,
      is_new: true,
    }));

    const users = await Users.bulkCreate(newUsers);

    return successResponse(users, "Users importes successfully");
  } catch (error: any) {
    console.error("Error import users:", error);
    return errorResponse("Failed to import users", 500);
  }
}
