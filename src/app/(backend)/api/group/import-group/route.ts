import AccessType from "@/db/models/access-type";
import Group from "@/db/models/group";
import GroupMembers from "@/db/models/group-members";
import Users from "@/db/models/user";
import { errorResponse, successResponse } from "@/utils/response.decorator";
import { Op } from "sequelize";
import env from "@/db/config/env";

export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

// Handle POST requests for creating a group record
export async function POST(request: Request) {
  const transaction = await Group.sequelize?.transaction(); // Start transaction

  try {
    const body = await request.json();
    const extractGroups = body.filter((data: any) => !data.Teams);

    for (let i = 0; i < extractGroups.length; i++) {
      // 1. Find access type
      const getAccessType: any = await AccessType.findOne({
        where: { name: body[i]?.AccessType },
        transaction,
      });

      // 2. Find existing users in the group
      let getAllUsers = await Users.findAll({
        where: {
          email: { [Op.in]: body[i]?.Users },
        },
        transaction,
      });

      // 3. Identify missing users that need to be created
      const missingUsers: string[] = Array.from(
        new Set(
          ((body[i]?.Users as string[]) ?? []) // Ensure it's an array of strings
            .map((email) => email.toLowerCase()) // Normalize & remove duplicates
        )
      ).filter(
        (userEmail) =>
          !getAllUsers.some((user) => user.email.toLowerCase() === userEmail) // Case-insensitive check
      );

      // 4. Create missing users in bulk
      if (missingUsers.length) {
        const newUsers = await Users.bulkCreate(
          missingUsers.map((email) => ({
            email,
            password: env.DEFAULT_PASSWORD,
            name: email.split("@")[0],
            image: "./files/survey-images/default.png",
            role_id: 2,
            identifier: "",
            is_new: true,
          })),
          { returning: true, transaction }
        );
        getAllUsers = [...getAllUsers, ...newUsers]; // Merge new users
      }

      // 6. Create the group
      const newGroup = await Group.create(
        {
          name: body[i].GroupName,
          access_type_id: getAccessType?.id,
          is_active: body[i]?.Active,
          is_delete: body[i]?.Deleted,
          created_at: body[i]?.GroupCreationTime?.["$date"],
          identifier: body[i]?._id["$oid"],
          is_new: true,
        },
        { transaction }
      );

      // 7. Create group members
      await GroupMembers.bulkCreate(
        getAllUsers.map((user) => ({
          group_id: newGroup.id,
          user_id: user.id,
        })),
        { transaction }
      );
    }

    await transaction?.commit(); // Commit transaction if everything is successful

    return successResponse(
      {
        extractGroups: extractGroups.length,
      },
      "Group created successfully"
    );
  } catch (error: any) {
    await transaction?.rollback(); // Rollback transaction in case of error
    console.error("Error creating group:", error);
    return errorResponse(error.message || "Failed to create group", 500);
  }
}
