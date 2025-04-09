import { DataTypes, Model } from "sequelize";
import sequelize from "@/db/config/config";

class Supplier extends Model {
  public id!: number; // Primary key
  public vendorName!: string;
  public vendorNumber!: string;
  public vendorC!: string;
  public Co_id!: string;
  public vendorFullInfo!: string;
  public is_new!: boolean;
}

Supplier.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    "Vendor Name": {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "Vendor Name",
    },

    "Vendor #": {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "Vendor #",
    },
    vendor_c: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "vendor_c",
    },
    Co_id: {
      type: DataTypes.STRING(2),
      allowNull: true,
    },
    vendorFullInfo: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    is_new: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
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
    tableName: "supplier",
    sequelize,
    timestamps: true,
    freezeTableName: true,
    paranoid: true,
    createdAt: "created_at", // Map to snake_case column name
    updatedAt: "updated_at", // Map to snake_case column name
    deletedAt: "deleted_at", // Map to snake_case column name
    indexes: [
      {
        fields: ["vendorFullInfo"],
      },
    ],
  }
);

export default Supplier;
// (async function syncUserTable() {
//   try {
//     await Supplier.sync({ alter: true });
//     console.log("The User table has been recreated successfully!");
//   } catch (error) {
//     console.error("Error occurred while syncing the User table:", error);
//   } finally {
//     console.log("Database connection closed.");
//   }
// })();
