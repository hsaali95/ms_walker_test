import { DataTypes, Model } from "sequelize";
import sequelize from "@/db/config/config";
import AccessType from "./access-type";
import GroupMembers from "./group-members";

class Group extends Model {
  public id!: number;
  public name!: string;
  public identifier!: string;
  public access_type_id!: number;
  public is_active!: boolean;
  public is_new!: boolean;
  public is_delete!: boolean;
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
    identifier: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
    },
    access_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    is_new: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    is_delete: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
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
GroupMembers.belongsTo(Group, {
  as: "group_memebrs_with_group",
  foreignKey: "group_id",
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
