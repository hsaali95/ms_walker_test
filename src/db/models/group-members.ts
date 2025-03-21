import { DataTypes, Model } from "sequelize";
import sequelize from "@/db/config/config";
import Users from "./user";

class GroupMembers extends Model {
  public id!: number;
  public group_id!: number;
  public user_id!: number;
}

GroupMembers.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
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
    tableName: "group_members",
    sequelize,
    timestamps: true,
    freezeTableName: true,
    paranoid: true,
    createdAt: "created_at", // Map to snake_case column name
    updatedAt: "updated_at", // Map to snake_case column name
    deletedAt: "deleted_at", // Map to snake_case column name
  }
);
export default GroupMembers;
GroupMembers.belongsTo(Users, {
  as: "users_group",
  foreignKey: "user_id",
});

Users.hasMany(GroupMembers, {
  as: "users_groups",
  sourceKey: "id",
  foreignKey: "user_id",
});


// (async function syncUserTable() {
//   try {
//     await GroupMembers.sync({ force: true });
//     console.log("The User table has been recreated successfully!");
//   } catch (error) {
//     console.error("Error occurred while syncing the User table:", error);
//   } finally {
//     console.log("Database connection closed.");
//   }
// })();
