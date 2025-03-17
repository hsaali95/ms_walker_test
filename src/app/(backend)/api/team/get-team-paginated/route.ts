import TeamManagers from "@/db/models/team-managers";
import TeamMembers from "@/db/models/team-members";
import Team from "@/db/models/teams";
import Users from "@/db/models/user";
import JWTService from "@/services/jwt/jwt-services";
import { errorResponse, successResponse } from "@/utils/response.decorator";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

// Handle GET requests for fetching paginated teams
export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  try {
    // Retrieve cookies from the request headers
    let token: string | null = null;

    if (cookieHeader) {
      // Parse cookies to extract the token
      const cookies = Object.fromEntries(
        cookieHeader.split("; ")?.map((cookie) => {
          const [key, value] = cookie.split("=");
          return [key, value];
        })
      );
      token = cookies["session_accessToken"]; // Replace "session_accessToken" with your cookie's name
    }

    // Verify the access token
    const userData: any = await JWTService.verifyAccessToken(token || "");

    const { searchParams } = new URL(request.url);

    // Pagination parameters
    const page = Number(searchParams.get("page")) || 1;
    const recordsPerPage = Number(searchParams.get("recordsPerPage")) || 10;
    const offset = (page - 1) * recordsPerPage;

    // Manager-specific filtering
    const forManager =
      userData?.id && userData?.role_id === 3 // Role ID 3 corresponds to manager
        ? { user_id: userData?.id }
        : undefined;

    // Fetch teams with pagination and associations
    const data = await Team.findAndCountAll({
      limit: recordsPerPage,
      offset,
      include: [
        {
          model: TeamManagers,
          as: "team_managers",

          where: forManager,
          include: [
            {
              model: Users,
              as: "user",
              attributes: { exclude: ["password"] },
            },
          ],
        },
        {
          model: TeamMembers,
          as: "team_members",
          separate: true,
          include: [
            {
              model: Users,
              as: "teams_group",
              attributes: ["id", "fullNameWithEmail", "name", "email"],
            },
          ],
        },
      ],
      order: [["id", "desc"]],
    });

    // Return the paginated teams
    return successResponse(data);
  } catch (error) {
    console.error("Error fetching teams:", error);
    return errorResponse("Failed to fetch teams", 500);
  }
}
