import { DataTypes, Model } from "sequelize";
import sequelize from "@/db/config/config";

class Account extends Model {
  public id!: number; // Primary key
  public locNumber!: string | null;
  public custNumber!: number | null;
  public customerName!: string | null;
  public address1!: string | null;
  public address2!: string | null;
  public city!: string | null;
  public state!: string | null;
  public zip!: string | null;
  public zipPlus4!: string | null;
  public telephone!: string | null;
  public customerContact!: string | null;
  public mailTo!: string | null;
  public abcNumber!: string | null;
  public cmpCd!: string | null;
  public commission!: string | null;
  public txChek!: string | null;
  public lSlsmanNumber!: string | null;
  public wSlsmanNumber!: string | null;
  public sSlsmanNumber!: string | null;
  public hSlsmanNumber!: string | null;
  public mSlsmanNumber!: string | null;
  public territory!: string | null;
  public chain!: string | null;
  public accum!: string | null;
  public creditCode!: string | null;
  public creditLimit!: string | null;
  public cashDisc!: string | null;
  public pcd!: string | null;
  public dcd!: string | null;
  public type!: string | null;
  public sub!: string | null;
  public routeNumber!: string | null;
  public stopNumber!: string | null;
  public stop2!: string | null;
  public delDay!: string | null;
  public shippingInstructions!: string | null;
  public deliveryInstructions!: string | null;
  public inactiveFlag!: string | null;
  public codDesc!: string | null;
  public daysPastDue!: string | null;
  public creditRestrict!: string | null;
  public combineInvoice!: string | null;
  public bailmentCode!: string | null;
  public bofill!: string | null;
  public wineNalcOnly!: string | null;
  public printScc!: string | null;
  public countyCode!: string | null;
  public cityTax!: string | null;
  public contact2!: string | null;
  public faxPhone!: string | null;
  public email!: string | null;
  public webUrl!: string | null;
  public taxId!: string | null;
  public secondCopyInv!: string | null;
  public tradingPartner!: string | null;
  public tradingPartStore!: string | null;
  public statementCode!: string | null;
  public statementEmail!: string | null;
  public alternateCarrier!: string | null;
  public allowSubItem!: string | null;
  public contactTitle!: string | null;
  public contactName!: string | null;
  public contactEmail!: string | null;
  public phoneNumber!: string | null;
  public mobileNumber!: string | null;
  public phoneExt!: string | null;
  public jobTitle!: string | null;
  public dellDay!: string | null;
  public fullCustomerInfo!: string;
}

Account.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    locNumber: { type: DataTypes.STRING(50), field: "LOC #" },
    custNumber: { type: DataTypes.INTEGER, field: "CUST NO" },
    customerName: { type: DataTypes.STRING(50), field: "CUSTOMER NAME" },
    address1: { type: DataTypes.STRING(50), field: "ADDRESS1" },
    address2: { type: DataTypes.STRING(50), field: "ADDRESS2" },
    city: { type: DataTypes.STRING(50), field: "CITY" },
    state: { type: DataTypes.STRING(50), field: "STATE" },
    zip: { type: DataTypes.STRING(50), field: "ZIP" },
    zipPlus4: { type: DataTypes.STRING(50), field: "ZIP+4" },
    telephone: { type: DataTypes.STRING(50), field: "TELEPHONE" },
    customerContact: { type: DataTypes.STRING(50), field: "CUSTOMER CONTACT" },
    mailTo: { type: DataTypes.STRING(50), field: "MAIL-TO" },
    abcNumber: { type: DataTypes.STRING(50), field: "A B C  NO " },
    cmpCd: { type: DataTypes.STRING(50), field: "CMP-Cd" },
    commission: { type: DataTypes.STRING(50), field: "COMMISSION" },
    txChek: { type: DataTypes.STRING(50), field: "TXCHEK" },
    lSlsmanNumber: { type: DataTypes.STRING(50), field: "L-SLSMAN #" },
    wSlsmanNumber: { type: DataTypes.STRING(50), field: "W-SLSMAN #" },
    sSlsmanNumber: { type: DataTypes.STRING(50), field: "S-SLSMAN #" },
    hSlsmanNumber: { type: DataTypes.STRING(50), field: "H-SLSMAN #" },
    mSlsmanNumber: { type: DataTypes.STRING(50), field: "M-SLSMAN #" },
    territory: { type: DataTypes.STRING(50), field: "TERRITORY" },
    chain: { type: DataTypes.STRING(50), field: "CHAIN" },
    accum: { type: DataTypes.STRING(50), field: "ACCUM" },
    creditCode: { type: DataTypes.STRING(50), field: "CREDIT CODE" },
    creditLimit: { type: DataTypes.STRING(50), field: "CREDIT LIMIT" },
    cashDisc: { type: DataTypes.STRING(50), field: "CASH DISC" },
    pcd: { type: DataTypes.STRING(50), field: "PCD" },
    dcd: { type: DataTypes.STRING(50), field: "DCD" },
    type: { type: DataTypes.STRING(50), field: "TYPE" },
    sub: { type: DataTypes.STRING(50), field: "SUB" },
    routeNumber: { type: DataTypes.STRING(50), field: "ROUTE NO" },
    stopNumber: { type: DataTypes.STRING(50), field: "STOP NO" },
    stop2: { type: DataTypes.STRING(50), field: "STOP 2" },
    delDay: { type: DataTypes.STRING(50), field: "DEL  DAY" },
    shippingInstructions: {
      type: DataTypes.STRING(50),
      field: "SHIPPING INSTRUCTIONS",
    },
    deliveryInstructions: {
      type: DataTypes.STRING(50),
      field: "DELIVERY INSTRUCTIONS",
    },
    inactiveFlag: { type: DataTypes.STRING(50), field: "INACTIVE FLAG" },
    codDesc: { type: DataTypes.STRING(50), field: "C O D DESC" },
    daysPastDue: { type: DataTypes.STRING(50), field: "DAYS PAST DUE" },
    creditRestrict: { type: DataTypes.STRING(50), field: "CREDIT RESTRICT" },
    combineInvoice: { type: DataTypes.STRING(50), field: "COMBINE INVOICE" },
    bailmentCode: { type: DataTypes.STRING(50), field: "BAILMENT CODE" },
    bofill: { type: DataTypes.STRING(50), field: "B O FILL" },
    wineNalcOnly: { type: DataTypes.STRING(50), field: "WINE NALC ONLY" },
    printScc: { type: DataTypes.STRING(50), field: "PRINT SCC" },
    countyCode: { type: DataTypes.STRING(50), field: "COUNTY CODE" },
    cityTax: { type: DataTypes.STRING(50), field: "CITY TAX" },
    contact2: { type: DataTypes.STRING(50), field: "CONTACT 2" },
    faxPhone: { type: DataTypes.STRING(50), field: "FAX PHONE#" },
    email: { type: DataTypes.STRING(50), field: "EMAIL" },
    webUrl: { type: DataTypes.STRING(50), field: "WEB URL" },
    taxId: { type: DataTypes.STRING(50), field: "TAX ID" },
    secondCopyInv: { type: DataTypes.STRING(50), field: "SECOND COPY INV" },
    tradingPartner: { type: DataTypes.STRING(50), field: "TRADING PARTNER" },
    tradingPartStore: {
      type: DataTypes.STRING(50),
      field: "TRADING PART STORE",
    },
    statementCode: { type: DataTypes.STRING(50), field: "STATEMENT CODE" },
    statementEmail: { type: DataTypes.STRING(50), field: "STATEMENT EMAIL" },
    alternateCarrier: {
      type: DataTypes.STRING(50),
      field: "ALTERNATE CARRIER",
    },
    allowSubItem: { type: DataTypes.STRING(50), field: "ALLOW SUB ITEM" },
    contactTitle: { type: DataTypes.STRING(50), field: "CONTACT TITLE" },
    contactName: { type: DataTypes.STRING(50), field: "CONTACT NAME" },
    contactEmail: { type: DataTypes.STRING(50), field: "CONTACT EMAIL" },
    phoneNumber: { type: DataTypes.STRING(50), field: "PHONE NUMBER" },
    mobileNumber: { type: DataTypes.STRING(50), field: "MOBILE NUMBER" },
    phoneExt: { type: DataTypes.STRING(50), field: "PHONE EXT" },
    jobTitle: { type: DataTypes.STRING(50), field: "JOB TITLE" },
    dellDay: { type: DataTypes.STRING(50), field: "DEL DAY" },
    fullCustomerInfo: {
      type: DataTypes.STRING(50),
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
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "account",
    sequelize,
    timestamps: true,
    freezeTableName: true,
    paranoid: true,
    createdAt: "created_at", // Map to snake_case column name
    updatedAt: "updated_at", // Map to snake_case column name
    deletedAt: "deleted_at", // Map to snake_case column name
    indexes: [
      {
        fields: ["CUST NO"],
      },
      {
        fields: ["CUSTOMER NAME"],
      },
      {
        fields: ["CITY"],
      },
    ],
  }
);

export default Account;

// (async function syncUserTable() {
//   try {
//     await Account.sync({ alter: true });
//     console.log("The User table has been recreated successfully!");
//   } catch (error) {
//     console.error("Error occurred while syncing the User table:", error);
//   } finally {
//     console.log("Database connection closed.");
//   }
// })();
