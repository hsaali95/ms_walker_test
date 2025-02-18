import Account from "@/db/models/account";
import Display from "@/db/models/display";
import Item from "@/db/models/item";
import Supplier from "@/db/models/supplier";
import Survey from "@/db/models/survey";
import SurveyStatus from "@/db/models/survey-status";
import { Op } from "sequelize";

type SurveyDetail = {
  DetailID: number;
  meta_id: number;
  DisplayType: string;
  Supplier1Name: string;
  Other1Supplier: string;
  Item1Name: string;
  Other1Item: string;
  Number1Cases: number;
  Display1Cost: number;
  Image: string; // Note: There is a typo in your JSON key "Image:"
  notes: string;
  Active: number; // Possibly boolean, but using number as per provided data
  Status: string;
  id: number;
  DATARECORDID: string;
  Username: string;
  Date: string; // ISO date string
  Time: string; // Typo in JSON: "Time:"
  AccountName: string;
  AccountNumber: number;
  AccountCity: string;
  Rep02ID: number;
  Rep05ID: number;
};

export const transformSurvey = async (surveyData: SurveyDetail) => {
  let supplierId;
  let [item, account] = await Promise.all([
    Item.findOne({
      where: {
        Item: surveyData.Item1Name.split(" ").pop(),
      },
    }),
    Account.findOne({
      where: {
        "CUST NO": surveyData.AccountNumber,
      },
    }),
  ]);

  if (!account) {
    account = await Account.create({
      "CUST NO": surveyData.AccountNumber,
      "CUSTOMER NAME": surveyData.AccountName,
      "CUSTOMER CITY": surveyData.AccountCity,
    });
  }

  if (!item) {
    let supplier;
    if (surveyData.Supplier1Name) {
      supplier = await Supplier.findOne({
        where: {
          "Vendor Name": surveyData.Supplier1Name,
        },
      });
    } else {
      supplier = await Supplier.create({});
    }
    item = await Item.create({
      supplier_id: supplier!.id,
      Description: surveyData.Item1Name,
    });
    supplierId = supplier!.id;
  } else {
    supplierId = item?.supplier_id;
  }
  // eslint-disable-next-line
  let [surveyStatus, display] = await Promise.all([
    SurveyStatus.findOne({
      where: {
        status: {
          [Op.iLike]: surveyData.Status,
        },
      },
    }),
    Display.findOne({
      where: {
        display_type: surveyData.DisplayType,
      },
    }),
  ]);

  if (!display) {
    display = await Display.create({
      display_type: surveyData.DisplayType,
    });
  }

  return {
    other_supplier: surveyData.Other1Supplier,
    other_item: surveyData.Other1Item,
    number_of_cases: surveyData.Number1Cases || 0,
    display_coast: surveyData.Display1Cost || 0,
    notes: surveyData.notes,
    account_id: account.id,
    display_id: display.id,
    supplier_id: supplierId,
    item_id: item.id,
    survey_status_id: surveyStatus!.id,
    created_at: surveyData.Date,
  } as unknown as Survey;
};
