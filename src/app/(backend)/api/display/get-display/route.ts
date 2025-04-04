import AccessType from "@/db/models/access-type";
import Display from "@/db/models/display";
import Group from "@/db/models/group";
import GroupMembers from "@/db/models/group-members";
import JWTService from "@/services/jwt/jwt-services";
import { errorResponse, successResponse } from "@/utils/response.decorator";
import { NextRequest } from "next/server";
import { Op, Sequelize } from "sequelize";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

// Handle GET requests to fetch all display records
export async function GET(request: NextRequest) {
  const cookieHeader = request.headers.get("cookie");
  try {
    // Fetch all displays from the database

    // Retrieve cookies from the request headers
    let token: string | null = null;

    if (cookieHeader) {
      const cookies = Object.fromEntries(
        cookieHeader.split("; ")?.map((cookie) => {
          const [key, value] = cookie.split("=");
          return [key, value];
        })
      );
      token = cookies["session_accessToken"];
    }
    const userIdForAccessTypes: any = await JWTService.verifyAccessToken(
      token || ""
    );

    const userAssignedGroups = (await Group.findAll({
      attributes: [
        [
          Sequelize.literal('array_agg(DISTINCT "access_type"."id")'),
          "group_access_type_id",
        ],
      ],
      where: {
        is_active: true,
      },
      include: [
        {
          model: AccessType,
          as: "access_type",
          attributes: [],
          where: {
            name: {
              [Op.in]: ["Sales", "Merchandiser"],
            },
          },
        },
        {
          model: GroupMembers,
          as: "group_members",
          where: {
            user_id: userIdForAccessTypes.id,
          },
          attributes: [],
        },
      ],
      raw: true,
    })) as unknown as any;

    // eslint-disable-next-line
    let queryOptions: { [key: string]: any } = {};

    const accessTypes = userAssignedGroups[0].group_access_type_id;
    if (accessTypes && accessTypes.length) {
      queryOptions.where = {
        [Op.or]: [
          {
            group_access_type_id: {
              [Op.in]: accessTypes,
            },
          },
          {
            group_access_type_id: {
              [Op.eq]: null,
            },
          },
        ],
      };
    }

    const displays = await Display.findAll(queryOptions);

    // Check if any displays are found
    if (displays.length === 0) {
      return errorResponse("No displays found", 404);
    }

    return successResponse(displays);
  } catch (error: any) {
    console.error("Error fetching displays:", error);
    return errorResponse("Failed to fetch displays", 500);
  }
}
