// import Account from "@/db/models/account";
// import Activity from "@/db/models/activity";
// import { errorResponse, successResponse } from "@/utils/response.decorator";
// export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

// // Handle POST requests for activity creation
// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const insertActivity: any = [];
//     const insertRecordIds: any = [];
//     const importDataIds: [] | any = body.map((data: any) => data.DATARECORDID);

//     const previousDataIds = await Activity.findAll({
//       attributes: ["DATARECORDID"],
//     });
//     importDataIds.forEach((data: any) => {
//       const isExists = previousDataIds.includes(data);
//       if (!isExists) {
//         insertRecordIds.push(data);
//       }
//     });
//     console.log("************importDataIds************", importDataIds);
//     console.log("************insertRecordIds************", insertRecordIds);
//     for (let i = 0; i < body.length; i++) {
//       const isIdNotExist = insertRecordIds.includes(body[i].DATARECORDID);
//       const isAccount: any = await Account.findOne({
//         where: { customerName: body[i].AccountName },
//       });
//       if (!isIdNotExist) {
//         if (isAccount) {
//           insertActivity.push({
//             date: body[i].Date || null,
//             // start_time: body[i].StartTime,
//             start_time: null,
//             // end_time: body[i].EndTime,
//             end_time: null,
//             merch_rep_id: body[i].MerchRepId,
//             activity_log: body[i].ActivityLog,
//             is_complete: body[i].Complete === "Yes" ? 1 : 0,
//             DATARECORDID: body[i].DATARECORDID,
//             FormId: body[i].FormId,
//             GeoLocation: body[i].GeoLocation, // allow null
//             notes: body[i].Notes, // allow null
//             NumberOfCases: body[i].NumberOfCases, // allow null
//             account_id: isAccount.id,
//             is_import: true,
//           });
//         }
//       }
//     }

//     if (Array.isArray(insertActivity) && insertActivity.length) {
//       await Activity.bulkCreate(insertActivity, { returning: true });
//     } else {
//       return errorResponse("Record exists", 500);
//     }
//     return successResponse(
//       {
//         // myData: body.Sheet1,
//       },
//       "Activity created successfully"
//     );
//   } catch (error: any) {
//     console.error("Error creating activity:", error);
//     return errorResponse("Failed to create activity", 500);
//   }
// }

import Account from "@/db/models/account";
import Activity from "@/db/models/activity";
import { errorResponse, successResponse } from "@/utils/response.decorator";
import { Op } from "sequelize";

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

    for (const item of body) {
      if (!insertRecordIds.includes(String(item.DATARECORDID))) continue;
      let isAccountExist;
      if (item.AccountName) {
        [isAccountExist] = await Account.findOrCreate({
          where: {
            customerName: {
              [Op.iLike]: item.AccountName,
            },
          },
          defaults: {
            city: item.city,
            customerName: item.AccountName,
          },
        });
      } else {
        isAccountExist = await Account.create({
          city: item.City,
          customerName: item.AccountName,
        });
      }

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
          NumberOfCases: item.NumberOfCases === "NULL" || item.NumberOfCases === "null" ? null : item.NumberOfCases ,
          account_id: isAccountExist.id,
          is_import: true,
        });
      }
    }
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
