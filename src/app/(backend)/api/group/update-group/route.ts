import Group from "@/db/models/group";
import GroupMembers from "@/db/models/group-members";
import { errorResponse, successResponse } from "@/utils/response.decorator";
import { Op } from "sequelize";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

interface IGroupWithMember extends Group {
  group_members: GroupMembers[];
}
// Handle POST requests for creating a group record
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      name,
      access_type_id,
      is_active,
      users_list,
    }: {
      id: number;
      name: string;
      access_type_id: number;
      is_active: boolean;
      users_list: number[];
    } = body;
    // Find the groups by IDs
    const [group, existingGroupWithName] = await Promise.all([
      Group.findOne({
        where: {
          id: id,
        },
        include: [
          {
            model: GroupMembers,
            as: "group_members",
            attributes: ["id", "user_id"],
          },
        ],
      }) as unknown as IGroupWithMember,
      Group.findOne({
        where: {
          [Op.and]: {
            name,
          },
          [Op.not]: {
            id,
          },
        },
      }),
    ]);

    // Check if the group name already exists
    if (existingGroupWithName) {
      return errorResponse("A group with this name already exists", 409);
    }

    if (!group) {
      return errorResponse(`No group found with the provided ID`, 404);
    }

    // Basic validation
    if (!name || typeof name !== "string") {
      return errorResponse("Missing or invalid required field: name", 400);
    }

    if (!access_type_id || typeof access_type_id !== "number") {
      return errorResponse(
        "Missing or invalid required field: access_type_id",
        400
      );
    }

    if (typeof is_active !== "boolean") {
      return errorResponse("Missing or invalid required field: is_active", 400);
    }

    const deletedMembers: number[] = [];

    group.group_members.map((member) => {
      const index = users_list.indexOf(member.user_id);
      //item doesnot exist
      if (index == -1) {
        deletedMembers.push(member.id);
      } else {
        //removing already existing members
        users_list.splice(index, 1);
      }
    });

    await Promise.all([
      //deleting removed members
      GroupMembers.destroy({
        where: {
          id: {
            [Op.in]: deletedMembers,
          },
        },
      }),
      //adding removed members
      GroupMembers.bulkCreate(
        users_list.map((userId) => ({
          group_id: id,
          user_id: userId,
        }))
      ),
      group.update({ name, access_type_id, is_active }),
    ]);

    return successResponse({}, "Group updated successfully");
  } catch (error: any) {
    console.error("Error creating group:", error);
    return errorResponse("Failed to update group", 500);
  }
}
