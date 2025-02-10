import { DataTypes, Model } from "sequelize";
import sequelize from "@/db/config/config";
import Role from "./role";

class Users extends Model {
  public id!: number;
  public email!: string;
  public password?: string;
  public name?: string;
  public image?: string;
  public role_id?: number;
  public fullNameWithEmail?: string; // Define the virtual attribute type
}

Users.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(255),
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
    fullNameWithEmail: {
      type: DataTypes.VIRTUAL, // Define as a virtual field
      get() {
        return `${this.getDataValue("name")} (${this.getDataValue("email")})`;
      },
    },
  },
  {
    tableName: "users",
    sequelize,
    timestamps: true,
    freezeTableName: true,
    paranoid: true,
    createdAt: "created_at", // Map to snake_case column name
    updatedAt: "updated_at", // Map to snake_case column name
    deletedAt: "deleted_at", // Map to snake_case column name
  }
);

Users.belongsTo(Role, { foreignKey: "role_id", as: "role" });
export default Users;

// (async function syncUserTable() {
//   try {
//     await Users.sync({ alter: true });
//     console.log("The User table has been recreated successfully!");
//   } catch (error) {
//     console.error("Error occurred while syncing the User table:", error);
//   } finally {
//     console.log("Database connection closed.");
//   }
// })();
