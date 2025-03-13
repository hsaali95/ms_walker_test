import { errorResponse, successResponse } from "@/utils/response.decorator";
import { TItem, transformItem } from "@/utils/transformer";
import Item from "@/db/models/item";
import Supplier from "@/db/models/supplier";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

// Handle POST requests for user creation
export async function POST(request: Request) {
  try {
    const items: TItem[] = await request.json();
    const existingItems = await Item.findAll({
      attributes: ["Item"],
    });
    const existingSuppliers = await Supplier.findAll({
      attributes: ["id", "Vendor #"],
    });
    const itemsWithSupplier: any[] = [];
    const itemsWithOutSupplier: any[] = [];
    items
      .filter(
        (item) =>
          !existingItems.some(
            (existingItem) => existingItem.dataValues.Item == item.Item
          )
      )
      .map((item) => {
        const supplier = existingSuppliers.find(
          (supplier) => +supplier.dataValues["Vendor #"] == item["Vendor #"]
        );
        const transformed = transformItem(item, supplier);
        // eslint-disable-next-line
        supplier
          ? itemsWithSupplier.push(transformed)
          : itemsWithOutSupplier.push(transformed);
      });

    await Promise.all([
      Item.bulkCreate(itemsWithSupplier),
      Item.bulkCreate(itemsWithOutSupplier, {
        include: ["Supplier"],
      }),
    ]);

    return successResponse(
      itemsWithSupplier.length + itemsWithOutSupplier.length,
      "Items Imported successfully"
    );
  } catch (error: any) {
    console.error("Error import Items:", error);
    return errorResponse("Failed to import Items", 500);
  }
}
