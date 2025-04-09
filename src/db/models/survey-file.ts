import { DataTypes, Model } from "sequelize";
import sequelize from "@/db/config/config";
import File from "./file";

class SurveyFile extends Model {
  public id!: number;
  public survey_id!: number;
  public file_id!: number;
}

SurveyFile.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    survey_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Surveys",
        key: "id",
      },
    },
    file_id: {
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
    tableName: "survey_file",
    sequelize,
    timestamps: true,
    freezeTableName: true,
    paranoid: true,
    createdAt: "created_at", // Map to snake_case column name
    updatedAt: "updated_at", // Map to snake_case column name
    deletedAt: "deleted_at", // Map to snake_case column name
  }
);

SurveyFile.belongsTo(File, {
  foreignKey: "file_id",
  as: "file",
});

export default SurveyFile;

// (async function syncUserTable() {
//   try {
//     await SurveyFile.sync({ force: true });
//     console.log("The User table has been recreated successfully!");
//   } catch (error) {
//     console.error("Error occurred while syncing the User table:", error);
//   } finally {
//     console.log("Database connection closed.");
//   }
// })();
