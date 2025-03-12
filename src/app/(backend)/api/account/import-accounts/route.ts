import { errorResponse, successResponse } from "@/utils/response.decorator";
import Account from "@/db/models/account";
import { TCustomers, transformAccount } from "@/utils/transformer";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request



// Handle POST requests for user creation
export async function POST(request: Request) {
  try {
    let accounts: TCustomers[] = await request.json();
    const existingAccounts = await Account.findAll({
      attributes: ["custNumber"],
    });

    const accountsToInsert = accounts
      .filter(
        (account) =>
          !existingAccounts.some(
            (existingAcc) =>
              existingAcc.dataValues.custNumber === account["CUST NO "]
          )
      )
      .map((account) => {
        return transformAccount(account)
      });


   const newAccounts = await Account.bulkCreate(accountsToInsert);

    return successResponse(newAccounts.length, "Accounts Imported successfully");
  } catch (error: any) {
    console.error("Error import Accounts:", error);
    return errorResponse("Failed to import Accounts", 500);
  }
}
