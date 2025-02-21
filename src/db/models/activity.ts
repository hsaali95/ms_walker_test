import { DataTypes, Model } from "sequelize";
import sequelize from "@/db/config/config";
import Account from "./account";

class Activity extends Model {
  public id!: number;
  public start_time!: Date;
  public end_time!: Date;
  public date!: Date;
  public is_complete!: boolean;
  public account_id!: number;
  public activity_log!: string;
  public notes!: string;
  public merch_rep_id!: string;
}

Activity.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    is_complete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    activity_log: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    notes: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    merch_rep_id: {
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
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "activities",
    sequelize,
    timestamps: true,
    freezeTableName: true,
    paranoid: true,
    createdAt: "created_at", // Map to snake_case column name
    updatedAt: "updated_at", // Map to snake_case column name
    deletedAt: "deleted_at", // Map to snake_case column name
  }
);
Activity.belongsTo(Account, {
  foreignKey: "account_id",
  as: "activity_account",
});
export default Activity;
