import { DataTypes, Model } from "sequelize";
import sequelize from "@/db/config/config";

class Item extends Model {
  public id!: number; // Primary key
  public Item!: string;
  public Size!: string;
  public Description!: string;
  public "Vendor #": string;
  public "Brand #": string;
  public Brand_Description!: string;
  public supplier_id!: number;
  public ItemFullInfo!: string;
}

Item.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Item: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    Size: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    Description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    "Vendor #": {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    "Brand #": {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    Brand_Description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ItemFullInfo: {
      type: DataTypes.STRING(255),
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
    tableName: "item", // Use the original table name
    sequelize,
    timestamps: true,
    freezeTableName: true,
    paranoid: true,
    createdAt: "created_at", // Map to snake_case column name
    updatedAt: "updated_at", // Map to snake_case column name
    deletedAt: "deleted_at", // Map to snake_case column name
    indexes: [
      {
        fields: ["ItemFullInfo"],
      },
      {
        fields: ["Brand #"],
      },
      {
        fields: ["Brand_Description"],
      },
    ],
  }
);

export default Item;

// (async function syncUserTable() {
//   try {
//     await Item.sync({ alter: true });
//     console.log("The User table has been recreated successfully!");
//   } catch (error) {
//     console.error("Error occurred while syncing the User table:", error);
//   } finally {
//     console.log("Database connection closed.");
//   }
// })();
