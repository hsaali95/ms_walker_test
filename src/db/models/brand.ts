import { DataTypes, Model } from "sequelize";
import sequelize from "@/db/config/config";

class Brand extends Model {
  public id!: number; // Primary key
  public "Brand #": string;
  public Brand_Description!: string;
  public item_id!: number;
}

Brand.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    "Brand #": {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    Brand_Description: {
      type: DataTypes.STRING(255),
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
    tableName: "brand", // Use the original table name
    sequelize,
    timestamps: true,
    freezeTableName: true,
    paranoid: true,
    createdAt: "created_at", // Map to snake_case column name
    updatedAt: "updated_at", // Map to snake_case column name
    deletedAt: "deleted_at", // Map to snake_case column name
  }
);

export default Brand;
