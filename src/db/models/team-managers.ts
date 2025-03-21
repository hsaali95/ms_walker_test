import { DataTypes, Model } from "sequelize";
import sequelize from "@/db/config/config";
import Users from "./user";

class TeamManagers extends Model {
  public id!: number;
  public team_id!: number;
  public user_id!: number;
}

TeamManagers.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    team_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: { // actually it is manager id taken from user table 
      type: DataTypes.INTEGER,
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
    tableName: "team_managers",
    sequelize,
    timestamps: true,
    freezeTableName: true,
    paranoid: true,
    createdAt: "created_at", // Map to snake_case column name
    updatedAt: "updated_at", // Map to snake_case column name
    deletedAt: "deleted_at", // Map to snake_case column name
  }
);

export default TeamManagers;

TeamManagers.belongsTo(Users, {
  foreignKey: "user_id",
  as: "user",
});
Users.hasMany(TeamManagers, {
  as: "users_team_manager",
  sourceKey: "id",
  foreignKey: "user_id",
});

// (async function syncUserTable() {
//   try {
//     await TeamManagers.sync({ force: true });
//     console.log("The User table has been recreated successfully!");
//   } catch (error) {
//     console.error("Error occurred while syncing the User table:", error);
//   } finally {
//     console.log("Database connection closed.");
//   }
// })();
