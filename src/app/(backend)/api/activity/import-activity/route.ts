import Account from "@/db/models/account";
import Activity from "@/db/models/activity";
import { errorResponse, successResponse } from "@/utils/response.decorator";

export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const insertActivity: any = [];
    const insertRecordIds: any = [];
    const importDataIds = body.map((data: any) => String(data.DATARECORDID));

    // Fetch existing activity IDs
    const previousDataIds = (
      await Activity.findAll({
        attributes: ["DATARECORDID"],
      })
    ).map((item) => String(item.DATARECORDID));

    // Filter out existing records
    importDataIds.forEach((data: any) => {
      if (!previousDataIds.includes(data)) {
        insertRecordIds.push(data);
      }
    });

    // console.log("************importDataIds************", importDataIds);
    // console.log("************insertRecordIds************", insertRecordIds);

    // Fetch all accounts at once
    const allAccounts = await Account.findAll({
      attributes: ["id", "customerName"],
    });
    const accountMap = new Map(
      allAccounts.map((acc) => [acc.customerName, acc.id])
    );
    for (const item of body) {
      if (!insertRecordIds.includes(String(item.DATARECORDID))) continue;

      const accountId = accountMap.get(item.AccountName);
      //   console.log("accountMap", accountMap);
      //   console.log("accountId", accountId);
      console.log("item.ActivityLog", item.ActivityLog);
      let isAccountExist;
      if (accountId) {
        isAccountExist = await Account.findOne({
          where: { customerName: item.AccountName },
        });
      }
      console.log("isAccountExist", isAccountExist);
      if (isAccountExist) {
        insertActivity.push({
          date: item.Date ? item.Date.split("T")[0] : null,
          start_time: item.StartTime ? item.StartTime.split("-")[0] : null,
          end_time: item.EndTime ? item.EndTime.split("-")[0] : null,
          merch_rep_id: item.MerchRepId,
          activity_log: item.ActivityLog,
          is_complete: item.Complete === "Yes" ? true : false,
          DATARECORDID: String(item.DATARECORDID),
          FormId: item.FormId,
          GeoLocation: item.GeoLocation || null,
          notes: item.Notes || null,
          NumberOfCases: item.NumberOfCases || null,
          account_id: isAccountExist.id,
          is_import: true,
        });
      }
    }
    console.log("insertActivity", insertActivity);
    if (insertActivity.length) {
      await Activity.bulkCreate(insertActivity, { returning: true });
      return successResponse({}, "Activity created successfully");
    } else {
      return errorResponse("Record already exists", 409);
    }
  } catch (error: any) {
    console.error("Error creating activity:", error);
    return errorResponse("Failed to create activity", 500);
  }
}
