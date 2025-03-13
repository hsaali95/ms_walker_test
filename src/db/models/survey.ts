import { DataTypes, Model } from "sequelize";
import sequelize from "@/db/config/config";
import Account from "./account";
import Display from "./display";
import Item from "./item";
import Supplier from "./supplier";
import SurveyStatus from "./survey-status";
import SurveyFile from "./survey-file";

class Survey extends Model {
  public id!: number; // Primary key
  public other_supplier!: string; // Other supplier
  public other_item!: string; // Other item
  public number_of_cases!: string; // Number of cases
  public display_coast!: string; // Display cost
  public notes!: string; // Notes
  public account_id!: number;
  public display_id!: number;
  public supplier_id!: number;
  public item_id!: number;
  public survey_status_id!: number;
  public is_new!: boolean;
  public DATARECORDID!: string;
  public meta_id!: string;
  public identifier!: string;
}

Survey.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    other_supplier: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    other_item: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    number_of_cases: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    display_coast: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    notes: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    survey_status_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
    },
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    display_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_new: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true,
    },
    DATARECORDID: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    meta_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    identifier: {
      type: DataTypes.STRING,
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
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "survey",
    sequelize,
    timestamps: true,
    freezeTableName: true,
    paranoid: true,
    createdAt: "created_at", // Map to snake_case column name
    updatedAt: "updated_at", // Map to snake_case column name
    deletedAt: "deleted_at", // Map to snake_case column name
    indexes: [
      {
        fields: ["account_id"], // Index for faster joins
      },
      {
        fields: ["display_id"], // Index for faster joins
      },
      {
        fields: ["supplier_id"], // Index for faster joins
      },
      {
        fields: ["item_id"], // Index for faster joins
      },
      {
        fields: ["survey_status_id"], // Index for filtering by status
      },
      {
        fields: ["deleted_at"], // Index for soft delete filtering
      },
      {
        fields: ["other_supplier"], // Index for text searches
      },
      {
        fields: ["other_item"], // Index for text searches
      },
    ],
  }
);

Survey.belongsTo(Account, {
  foreignKey: "account_id",
  as: "account",
});
Survey.belongsTo(Display, {
  foreignKey: "display_id",
  as: "display",
});
Survey.belongsTo(Item, {
  foreignKey: "item_id",
  as: "item",
});
Survey.belongsTo(Supplier, {
  foreignKey: "supplier_id",
  as: "supplier",
});
Survey.belongsTo(SurveyStatus, {
  foreignKey: "survey_status_id",
  as: "survey_status",
});
Survey.hasMany(SurveyFile, {
  foreignKey: "survey_id",
  as: "survey_file",
});

SurveyFile.belongsTo(Survey, { foreignKey: "survey_id" });

export default Survey;

// (async function syncUserTable() {
//   try {
//     await Survey.sync({ alter: true });
//     console.log("The User table has been recreated successfully!");
//   } catch (error) {
//     console.error("Error occurred while syncing the User table:", error);
//   } finally {
//     console.log("Database connection closed.");
//   }
// })();
