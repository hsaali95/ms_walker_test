import { DataTypes, Model } from "sequelize";
import sequelize from "@/db/config/config";
import TeamManagers from "./team-managers";
import TeamMembers from "./team-members";

class Team extends Model {
  public id!: number;
  public name!: string;
  public is_active!: boolean;
}

Team.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deleted_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "teams",
    sequelize,
    timestamps: true,
    freezeTableName: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

Team.hasMany(TeamManagers, {
  foreignKey: "team_id",
  as: "team_managers",
});

Team.hasMany(TeamMembers, {
  foreignKey: "team_id",
  as: "team_members",
});
export default Team;

// (async function syncUserTable() {
//   try {
//     await Team.sync({ alter: true });
//     console.log("The User table has been recreated successfully!");
//   } catch (error) {
//     console.error("Error occurred while syncing the User table:", error);
//   } finally {
//     console.log("Database connection closed.");
//   }
// })();
