import { DataTypes, Model } from "sequelize";
import sequelize from "@/db/config/config";

class Display extends Model {
  public id!: number; // Primary key
  public display_type!: string;
}

Display.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    display_type: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    supplier_name: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    item_name: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    no_of_cases: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    display_cost: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    images: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    notes: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    rename_display_cost: {
      type: DataTypes.STRING,
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
    tableName: "display",
    sequelize,
    timestamps: true,
    freezeTableName: true,
    paranoid: true,
    createdAt: "created_at", // Map to snake_case column name
    updatedAt: "updated_at", // Map to snake_case column name
    deletedAt: "deleted_at", // Map to snake_case column name
    indexes: [
      {
        fields: ["display_type"],
      },
    ],
  }
);

export default Display;

// (async function syncUserTable() {
//   try {
//     await Display.sync({ alter: true });
//     console.log("The User table has been recreated successfully!");
//   } catch (error) {
//     console.error("Error occurred while syncing the User table:", error);
//   } finally {
//     console.log("Database connection closed.");
//   }
// })();
