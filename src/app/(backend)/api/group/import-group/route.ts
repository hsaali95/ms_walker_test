import env from "@/db/config/env";
import AccessType from "@/db/models/access-type";
import Group from "@/db/models/group";
import Users from "@/db/models/user";
import { ROLE } from "@/utils/enums";
import { errorResponse, successResponse } from "@/utils/response.decorator";
import { transformGroup } from "@/utils/transformer";
import { promises as fs } from "fs";

export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

export type TTeam = {
  _id: { $oid: string };
  GroupName: string;
  Active: boolean;
  AccessType: string;
  Users: string[];
  GroupCreationTime: { $date: string };
  Deleted: boolean;
  Teams: boolean;
  Manager: string;
};

// Handle POST requests for user creation
export async function POST() {
  try {
    let records: TTeam[] = [];
    try {
      const file = await fs.readFile(
        process.cwd() + "/public/upload-json/mswalker-groups-teams.json",
        "utf8"
      );
      records = JSON.parse(file).filter(
        (record: TTeam) => record.Teams === false
      );
    } catch {
      return errorResponse("Records is required", 404);
    }
    const users = await Users.findAll({
      attributes: ["id", "email"],
    });
    const accesstypes = await AccessType.findAll({
      attributes: ["id", "name"]
    })
    const teams: number[] = [];
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const exited_users: number[] = [];
      const non_exited_users: string[] = [];

      record.Users.filter(
        (user, index, self) => self.indexOf(user.toLowerCase()) === index
      ).map((user) => {
        const currentUser = users.find(
          (db_user) => db_user.email.toLowerCase() === user.toLowerCase()
        );
        if (currentUser) {
          exited_users.push(currentUser.id);
        } else {
          non_exited_users.push(user);
        }
      });

      if (non_exited_users.length) {
        const newUsers = await createUsers(non_exited_users, ROLE.AGENT);
        users.push(...newUsers);
        exited_users.push(...newUsers.map((user) => user.id));
      }
      const accesstype = accesstypes.find(acc => acc.name?.toLowerCase() === record.AccessType.toLowerCase())!
     const group = transformGroup(record, exited_users,accesstype );
 
      const team = await Group.create(
        group,
        {
          include: [ "group_members"],
          returning: true,
        }
      );
      teams.push(team.id);
    }

    return successResponse(teams, "Teams Imported successfully");
  } catch (error: any) {
    console.error("Error import Teams:", error);
    return errorResponse("Failed to import Teams", 500);
  }
}

const createUsers = async (emails: string[], role_id: number) => {
  const newUsersData: Partial<Users>[] = [];
  emails.map((email) => {
    const newUserData = {
      email: email,
      password: env.DEFAULT_PASSWORD,
      name: email.split("@")[0],
      image:
        "./files/survey-images/f083b530-f531-4e6b-8e5c-d6558874fb4a_Vector (11).png",
      role_id: role_id,
      identifier: "",
      is_new: true,
    };
    newUsersData.push(newUserData);
  });

  const users = await Users.bulkCreate(newUsersData, { returning: true });
  return users;
};
