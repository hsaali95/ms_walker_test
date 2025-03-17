import { errorResponse, successResponse } from "@/utils/response.decorator";
import Role from "@/db/models/role";
import Users from "@/db/models/user";
import env from "@/db/config/env";
import { Op } from "sequelize";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

type TBody = {
  Id: string;
  UserId: string;
  RoleId: string;
  Email: string;
  UserName: string;
  Roles: string;
};

// Handle POST requests for user creation
export async function POST(request: Request) {
  try {
    const newUsers = await request.json();
    const existingUsers = await Users.findAll({
      where: {
        email: {
          [Op.in]: newUsers.map((user: TBody) => user.Email.toLowerCase()),
        },
      },
    });

    // const { Id, UserId, RoleId, Email, UserName } = body;
    const roles = await Role.findAll({
      attributes: ["id", "name", "identifier"],
    });
    const usersToCreate: any = [];

    newUsers.map((user: TBody) => {
    
      if (
        !existingUsers.find(
          (usr) => usr.email.toLowerCase() == user.Email.toLowerCase()
        )
      ) {
        usersToCreate.push({
          email: user.Email.toLowerCase(),
          password: env.DEFAULT_PASSWORD,
          name: user.Email.split("@")[0],
          image:
            "./files/survey-images/f083b530-f531-4e6b-8e5c-d6558874fb4a_Vector (11).png",
          role_id:
            roles.find(
              (role) => role.name?.toLowerCase() == user.Roles?.toLowerCase()
            )?.id || 13,
          identifier: user.Id,
          is_new: true,
        });
      }
    });

    const users = await Users.bulkCreate(usersToCreate);

    return successResponse(users, "Users importes successfully");
  } catch (error: any) {
    console.error("Error import users:", error);
    return errorResponse("Failed to import users", 500);
  }
}
