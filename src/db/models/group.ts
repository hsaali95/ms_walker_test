import { DataTypes, Model } from "sequelize";
import sequelize from "@/db/config/config";
import AccessType from "./access-type";
import GroupMembers from "./group-members";

class Group extends Model {
  public id!: number;
  public name!: string;
  public access_type_id!: number;
  public is_active!: boolean;
}

Group.init(
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
    access_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    tableName: "groups",
    sequelize,
    timestamps: true,
    freezeTableName: true,
    paranoid: true,
    createdAt: "created_at", // Map to snake_case column name
    updatedAt: "updated_at", // Map to snake_case column name
    deletedAt: "deleted_at", // Map to snake_case column name
  }
);
Group.belongsTo(AccessType, {
  foreignKey: "access_type_id",
  as: "access_type",
});
Group.hasMany(GroupMembers, {
  foreignKey: "group_id",
  as: "group_members",
});

export default Group;

// (async function syncUserTable() {
//   try {
//     await Group.sync({ force: true });
//     console.log("The User table has been recreated successfully!");
//   } catch (error) {
//     console.error("Error occurred while syncing the User table:", error);
//   } finally {
//     console.log("Database connection closed.");
//   }
// })();
