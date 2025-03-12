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
  const itemNo = surveyData.Item1Name.split(" ").pop();
  let [item, account] = await Promise.all([
    Item.findOne({
      where: {
        Item: itemNo,
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
  console.log(item);
  if (!item) {
    let supplier;
    if (surveyData.Supplier1Name) {
      supplier = await Supplier.findOne({
        where: {
          "Vendor Name": surveyData.Supplier1Name,
        },
      });
    } else {
      supplier = await Supplier.create({
        "Vendor Name": surveyData.Supplier1Name,
      });
    }
    item = await Item.create({
      supplier_id: supplier!.id,
      Description: surveyData.Item1Name,
      Item: itemNo,
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
    display_coast: surveyData.Display1Cost.toString().replaceAll("$", "") || 0,
    notes: surveyData.notes,
    account_id: account.id,
    display_id: display.id,
    supplier_id: supplierId,
    item_id: item.id,
    survey_status_id: surveyStatus!.id,
    created_at: surveyData.Date,
  } as unknown as Survey;
};

export type TCustomers = {
  "LOC #": number;
  "CUST NO ": number;
  "CUSTOMER NAME": string;
  ADDRESS1: string;
  ADDRESS2: string;
  CITY: string;
  STATE: string;
  ZIP: number;
  "ZIP+4": number;
  TELEPHONE: string;
  "CUSTOMER CONTACT": string;
  "MAIL-TO": number;
  "A B C  NO ": number;
  "CMP-Cd": number;
  TXCHEK: number;
  "L-SLSMAN #": number;
  "W-SLSMAN #": number;
  "S-SLSMAN #": number;
  "H-SLSMAN #": number;
  "M-SLSMAN #": number;
  TERRITORY: number;
  ACCUM: "Yes" | "No";
  "CREDIT CODE": number;
  "CREDIT LIMIT": number;
  "CASH DISC": "Y" | "N";
  PCD: number;
  DCD: string;
  TYPE: number;
  "ROUTE NO ": number;
  "STOP NO ": number;
  "STOP 2 ": number;
  "DEL  DAY": string;
  "DAYS PAST DUE": number;
  "CREDIT RESTRICT": "Y" | "N";
  "COMBINE INVOICE": "Y" | "N";
  "B O FILL": "Y" | "N";
  "WINE NALC ONLY": "Y" | "N";
  "FAX PHONE#": number;
  EMAIL: string;
  "TAX ID": string;
  "SECOND COPY INV": "Y" | "N";
  "STATEMENT CODE": string;
  "STATEMENT EMAIL": string;
  "ALTERNATE CARRIER": "Y" | "N";
  "ALLOW SUB ITEM": "Y" | "N";
  "CONTACT TITLE": string;
  "CONTACT NAME": string;
  "CONTACT EMAIL": string;
  "PHONE NUMBER": string;
  "MOBILE NUMBER": number;
  "SHIPPING INSTRUCTIONS": string;
  "DELIVERY INSTRUCTIONS": string;
  "C O D  DESC": string;
  COMMISSION: string;
  CHAIN: string;
  "INACTIVE FLAG": string;
  SUB: string;
  "BAILMENT CODE": string;
  "PRINT SCC": string;
  "COUNTY CODE": string;
  "CITY TAX": string;
  "CONTACT 2": string;
  "WEB URL": string;
  "TRADING PARTNER": string;
  "TRADING PART STORE": string;
  "PHONE EXT": string;
  "JOB TITLE": string;
  "DEL DAY": string;
};
export const transformAccount = (customer: TCustomers) => {
  return {
    locNumber: customer["LOC #"],
    custNumber: customer["CUST NO "],
    customerName: customer["CUSTOMER NAME"],
    address1: customer["ADDRESS1"],
    address2: customer["ADDRESS2"],
    city: customer["CITY"],
    state: customer["STATE"],
    zip: customer["ZIP"],
    zipPlus4: customer["ZIP+4"],
    telephone: customer["TELEPHONE"],
    customerContact: customer["CUSTOMER CONTACT"],
    mailTo: customer["MAIL-TO"],
    abcNumber: customer["A B C  NO "],
    cmpCd: customer["CMP-Cd"],
    commission: customer["COMMISSION"],
    txChek: customer["TXCHEK"],
    lSlsmanNumber: customer["L-SLSMAN #"],
    wSlsmanNumber: customer["W-SLSMAN #"],
    sSlsmanNumber: customer["S-SLSMAN #"],
    hSlsmanNumber: customer["H-SLSMAN #"],
    mSlsmanNumber: customer["M-SLSMAN #"],
    territory: customer["TERRITORY"],
    chain: customer["CHAIN"],
    accum: customer["ACCUM"],
    creditCode: customer["CREDIT CODE"],
    creditLimit: customer["CREDIT LIMIT"],
    cashDisc: customer["CASH DISC"],
    pcd: customer["PCD"],
    dcd: customer["DCD"],
    type: customer["TYPE"],
    sub: customer["SUB"],
    routeNumber: customer["ROUTE NO "],
    stopNumber: customer["STOP NO "],
    stop2: customer["STOP 2 "],
    delDay: customer["DEL  DAY"],
    shippingInstructions: customer["SHIPPING INSTRUCTIONS"],
    deliveryInstructions: customer["DELIVERY INSTRUCTIONS"],
    inactiveFlag: customer["INACTIVE FLAG"],
    codDesc: customer["C O D  DESC"],
    daysPastDue: customer["DAYS PAST DUE"],
    creditRestrict: customer["CREDIT RESTRICT"],
    combineInvoice: customer["COMBINE INVOICE"],
    bailmentCode: customer["BAILMENT CODE"],
    bofill: customer["B O FILL"],
    wineNalcOnly: customer["WINE NALC ONLY"],
    printScc: customer["PRINT SCC"],
    countyCode: customer["COUNTY CODE"],
    cityTax: customer["CITY TAX"],
    contact2: customer["CONTACT 2"],
    faxPhone: customer["FAX PHONE#"],
    email: customer["EMAIL"],
    webUrl: customer["WEB URL"],
    taxId: customer["TAX ID"],
    secondCopyInv: customer["SECOND COPY INV"],
    tradingPartner: customer["TRADING PARTNER"],
    tradingPartStore: customer["TRADING PART STORE"],
    statementCode: customer["STATEMENT CODE"],
    statementEmail: customer["STATEMENT EMAIL"],
    alternateCarrier: customer["ALTERNATE CARRIER"],
    allowSubItem: customer["ALLOW SUB ITEM"],
    contactTitle: customer["CONTACT TITLE"],
    contactName: customer["CONTACT NAME"],
    contactEmail: customer["CONTACT EMAIL"],
    phoneNumber: customer["PHONE NUMBER"],
    mobileNumber: customer["MOBILE NUMBER"],
    phoneExt: customer["PHONE EXT"],
    jobTitle: customer["JOB TITLE"],
    dellDay: customer["DEL  DAY"],
    isNew: true,
    fullCustomerInfo: customer["CUSTOMER NAME"] + " - " + customer["CUST NO "],
  };
};

export type TItem = {
  Item: string;
  Size: string;
  Description: string;
  "Vendor #": number;
  "Vendor Name": string;
  "Brand #": string;
  Brand_Description: string;
  Co_id: number;
};
export type TSupplier = {
  "Vendor Name": string;
  "Vendor #": number;
  vendor_c: string;
  Co_id: number;
  vendorFullInfo: string;
  is_new: boolean;
};

export const transformItem = (item: TItem, supplier: Supplier | undefined) => {
  return {
    Item: item.Item,
    Size: item.Size,
    Description: item.Description,
    "Brand #": item["Brand #"],
    Brand_Description: item["Brand_Description"],
    ItemFullInfo: item.Description + " - " + item.Item,
    is_new: true,
    "Vendor #": item["Vendor #"],
    supplier_id: supplier?.id,
    Supplier: supplier
      ? undefined
      : {
          "Vendor Name": item["Vendor Name"],
          "Vendor #": item["Vendor #"],
          vendor_c: item["Vendor Name"] + " - " + (item["Vendor #"] || ""),
          Co_id: item["Co_id"],
          vendorFullInfo:
            item["Vendor Name"] + " - " + (item["Vendor #"] || ""),
          is_new: true,
        },
  };
};
