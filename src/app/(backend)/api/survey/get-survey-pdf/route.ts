// import { v4 as uuidv4 } from "uuid";
// import { successResponse, errorResponse } from "@/utils/response.decorator";
// import Account from "@/db/models/account";
// import Display from "@/db/models/display";
// import Item from "@/db/models/item";
// import Supplier from "@/db/models/supplier";
// import SurveyStatus from "@/db/models/survey-status";
// import Survey from "@/db/models/survey";
// import puppeteer from "puppeteer";
// import SurveyFile from "@/db/models/survey-file";
// import File from "@/db/models/file";
// import { SURVEY_IMAGE_BASE_URL } from "@/utils/constant";
// import supabase from "@/utils/supabase-client";
// import fs from "fs";
// import path from "path";
// import moment from "moment";
// export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

// export async function POST(request: Request) {
//   try {
//     const { ids, startDate, endDate } = await request.json(); // Parse the incoming JSON payload

//     const notRequiredOption = [
//       "created_at",
//       "updated_at",
//       "deleted_at",
//       "deleted_by",
//     ];

//     // Build the where clause if IDs are provided
//     const whereClause = ids && ids.length > 0 ? { id: ids } : {};

//     // Fetch survey data from your database, excluding unnecessary fields
//     const data = await Survey.findAll({
//       where: whereClause,
//       attributes: {
//         exclude: [
//           "updated_at",
//           "deleted_at",
//           "deleted_by",
//           "account_id",
//           "display_id",
//           "supplier_id",
//           "item_id",
//           "survey_status_id",
//         ],
//       },
//       include: [
//         {
//           model: Account,
//           as: "account",
//           attributes: ["fullCustomerInfo", "custNumber", "city"],
//         },
//         {
//           model: Display,
//           as: "display",
//           attributes: { exclude: notRequiredOption },
//         },
//         {
//           model: Item,
//           as: "item",
//           attributes: ["ItemFullInfo"],
//         },
//         {
//           model: Supplier,
//           as: "supplier",
//           attributes: ["Vendor Name"],
//         },
//         {
//           model: SurveyStatus,
//           as: "survey_status",
//           attributes: { exclude: notRequiredOption },
//         },
//         {
//           model: SurveyFile,
//           as: "survey_file",
//           attributes: {
//             exclude: ["created_at", "updated_at", "deleted_at", "deleted_by"],
//           },
//           include: [
//             {
//               model: File,
//               as: "file",
//               attributes: {
//                 exclude: [
//                   "created_at",
//                   "updated_at",
//                   "deleted_at",
//                   "deleted_by",
//                 ],
//               },
//             },
//           ],
//         },
//       ],
//     });
//     console.log(
//       "**************************data******************************",
//       data
//     );
//     // Generate a unique filename for the PDF
//     const uniqueFileName = `surveys_${uuidv4()}.pdf`;
//     const logoPath = path.resolve(
//       process.cwd(),
//       "public/assets/images/ms_walker_logo.png"
//     );
//     const MsWalkerLogoBase64 = fs.readFileSync(logoPath, "base64");
//     // Prepare the HTML content for the PDF
//     const htmlContent = `
//     <html>
//       <head>
//         <style>
//           body {
//             font-family: Arial, sans-serif;
//           }
//           table {
//             width: 100%;
//             border-collapse: collapse;
//             margin-top: 20px;
//           }
//           th {
//             background-color: #4F131F;
//             color: white;
//             border: 1px solid #4F131F;
//             padding: 8px;
//             text-align: left;
//           }
//           td {
//             border: 1px solid #4F131F;
//             padding: 8px;
//             text-align: left;
//           }
//           h2 {
//             color: #4F131F;
//             text-align: center;
//           }
//           h3 {
//             color: #4F131F;
//             text-align: right;
//           }
//           a {
//             color: #4F131F;
//             text-decoration: none;
//           }
//           a:hover {
//             text-decoration: underline;
//           }
//         </style>
//       </head>
//       <body>
//         <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 20px;">
//           <img
//             src="data:image/png;base64,${MsWalkerLogoBase64}"
//             alt="Survey Logo"
//             style="width: 300px; height: auto;"
//           />
//         </div>

//         <h2>Report</h2>
//         ${
//           startDate
//             ? `<h3>Date: from ${moment(startDate).format("DD/MM/YYYY")} to ${
//                 endDate
//                   ? moment(endDate).format("DD/MM/YYYY")
//                   : moment().format("DD/MM/YYYY")
//               }</h3>`
//             : ""
//         }

//         <table>
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Date</th>
//               <th>Customer Name</th>
//               <th>Customer Number</th>
//               <th>Customer City</th>
//               <th>Display Type</th>
//               <th>Supplier Name</th>
//               <th>Item Name</th>
//               <th>Status</th>
//               <th># of Cases</th>
//               <th>Display Cost</th>
//               <th>Images Links</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${
//               Array.isArray(data)
//                 ? data
//                     .map(
//                       (row: any) => `
//                       <tr>
//                         <td>${row.id || "-"}</td>
//                         <td>${row?.created_at ? moment(row.created_at).format("DD/MM/YYYY") : "-"}</td>
//                         <td>${row?.account?.fullCustomerInfo || "-"}</td>
//                         <td>${row?.account?.custNumber || "-"}</td>
//                         <td>${row?.account?.city || "-"}</td>
//                         <td>${row?.display?.display_type || "-"}</td>
//                         <td>${row?.supplier?.["Vendor Name"] || "-"}</td>
//                         <td>${row?.item?.ItemFullInfo || "-"}</td>
//                         <td>${row?.survey_status?.status || "-"}</td>
//                         <td>${row?.number_of_cases || "-"}</td>
//                         <td>${row?.display_coast || "-"}</td>
//                         <td>
//                           ${
//                             Array.isArray(row.survey_file)
//                               ? row.survey_file
//                                   .map((data: any, i: number) =>
//                                     data?.file?.path
//                                       ? `<a href="${SURVEY_IMAGE_BASE_URL + data.file.path}" target="_blank" rel="noopener noreferrer">
//                                                 View Image ${i + 1}
//                                               </a>`
//                                       : "-"
//                                   )
//                                   .join("<br />")
//                               : "-"
//                           }
//                         </td>
//                       </tr>
//                     `
//                     )
//                     .join("")
//                 : ""
//             }
//           </tbody>
//         </table>
//       </body>
//     </html>
//   `;

//     // Use Puppeteer to generate the PDF
//     const browser = await puppeteer.launch({
//       headless: true, // Always run in headless mode
//       args: ["--no-sandbox", "--disable-setuid-sandbox"], // Important for Vercel
//     });
//     const page = await browser.newPage();
//     await page.setViewport({
//       width: 1920,
//       height: 1080,
//       deviceScaleFactor: 2, // Increase DPI
//     });
//     await page.setContent(htmlContent, { waitUntil: "domcontentloaded" }); // Ensure all resources are loaded
//     const pdfBuffer = await page.pdf({
//       format: "a2",
//       printBackground: true,
//       preferCSSPageSize: true,
//     });
//     await browser.close();

//     // Upload the PDF file to Supabase storage
//     const { error: uploadError } = await supabase.storage
//       .from("mas-walker-file")
//       .upload(uniqueFileName, pdfBuffer, {
//         contentType: "application/pdf",
//       });

//     if (uploadError) {
//       console.error("Supabase upload error:", uploadError);
//       throw new Error("Failed to upload file to Supabase");
//     }

//     // Get the public URL of the uploaded file
//     const { data: publicUrlData } = supabase.storage
//       .from("mas-walker-file")
//       .getPublicUrl(uniqueFileName);

//     return successResponse(
//       {
//         filePath: publicUrlData.publicUrl,
//       },
//       "PDF file has been created and uploaded"
//     );
//   } catch (error) {
//     console.error("Error processing request:", error);
//     return errorResponse("Failed to process request", 500);
//   }
// }

import { v4 as uuidv4 } from "uuid";
import { successResponse, errorResponse } from "@/utils/response.decorator";
import Account from "@/db/models/account";
import Display from "@/db/models/display";
import Item from "@/db/models/item";
import Supplier from "@/db/models/supplier";
import SurveyStatus from "@/db/models/survey-status";
import Survey from "@/db/models/survey";
import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";
import SurveyFile from "@/db/models/survey-file";
import File from "@/db/models/file";
import { SURVEY_IMAGE_BASE_URL } from "@/utils/constant";
import supabase from "@/utils/supabase-client";
import fs from "fs";
import path from "path";
import moment from "moment";

export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

export async function POST(request: Request) {
  try {
    const { ids, startDate, endDate } = await request.json();

    const notRequiredOption = [
      "created_at",
      "updated_at",
      "deleted_at",
      "deleted_by",
    ];

    // Fetch survey data from your database
    const whereClause = ids && ids.length > 0 ? { id: ids } : {};
    const data = await Survey.findAll({
      where: whereClause,
      attributes: {
        exclude: [
          "updated_at",
          "deleted_at",
          "deleted_by",
          "account_id",
          "display_id",
          "supplier_id",
          "item_id",
          "survey_status_id",
        ],
      },
      include: [
        {
          model: Account,
          as: "account",
          attributes: ["fullCustomerInfo", "custNumber", "city"],
        },
        {
          model: Display,
          as: "display",
          attributes: { exclude: notRequiredOption },
        },
        {
          model: Item,
          as: "item",
          attributes: ["ItemFullInfo"],
        },
        {
          model: Supplier,
          as: "supplier",
          attributes: ["Vendor Name"],
        },
        {
          model: SurveyStatus,
          as: "survey_status",
          attributes: { exclude: notRequiredOption },
        },
        {
          model: SurveyFile,
          as: "survey_file",
          attributes: { exclude: notRequiredOption },
          include: [
            {
              model: File,
              as: "file",
              attributes: { exclude: notRequiredOption },
            },
          ],
        },
      ],
    });

    // Generate a unique filename for the PDF
    const uniqueFileName = `surveys_${uuidv4()}.pdf`;
    const logoPath = path.resolve(
      process.cwd(),
      "public/assets/images/ms_walker_logo.png"
    );
    const MsWalkerLogoBase64 = fs.readFileSync(logoPath, "base64");

    // Prepare the HTML content for the PDF
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #4F131F; color: white; border: 1px solid #4F131F; padding: 8px; text-align: left; }
            td { border: 1px solid #4F131F; padding: 8px; text-align: left; }
            h2 { color: #4F131F; text-align: center; }
            h3 { color: #4F131F; text-align: right; }
            a { color: #4F131F; text-decoration: none; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="data:image/png;base64,${MsWalkerLogoBase64}" alt="Survey Logo" style="width: 300px;" />
          </div>
          <h2>Report</h2>
          ${
            startDate
              ? `<h3>Date: from ${moment(startDate).format("DD/MM/YYYY")} to ${
                  endDate
                    ? moment(endDate).format("DD/MM/YYYY")
                    : moment().format("DD/MM/YYYY")
                }</h3>`
              : ""
          }
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Customer Name</th>
                <th>Customer Number</th>
                <th>Customer City</th>
                <th>Display Type</th>
                <th>Supplier Name</th>
                <th>Item Name</th>
                <th>Status</th>
                <th># of Cases</th>
                <th>Display Cost</th>
                <th>Images Links</th>
              </tr>
            </thead>
            <tbody>
              ${
                Array.isArray(data)
                  ? data
                      .map(
                        (row: any) => `
                        <tr>
                          <td>${row.id || "-"}</td>
                          <td>${row?.created_at ? moment(row.created_at).format("DD/MM/YYYY") : "-"}</td>
                          <td>${row?.account?.fullCustomerInfo || "-"}</td>
                          <td>${row?.account?.custNumber || "-"}</td>
                          <td>${row?.account?.city || "-"}</td>
                          <td>${row?.display?.display_type || "-"}</td>
                          <td>${row?.supplier?.["Vendor Name"] || "-"}</td>
                          <td>${row?.item?.ItemFullInfo || "-"}</td>
                          <td>${row?.survey_status?.status || "-"}</td>
                          <td>${row?.number_of_cases || "-"}</td>
                          <td>${row?.display_coast || "-"}</td>
                          <td>
                            ${
                              Array.isArray(row.survey_file)
                                ? row.survey_file
                                    .map((file: any, i: number) =>
                                      file?.file?.path
                                        ? `<a href="${SURVEY_IMAGE_BASE_URL + file.file.path}" target="_blank">View Image ${i + 1}</a>`
                                        : "-"
                                    )
                                    .join("<br />")
                                : "-"
                            }
                          </td>
                        </tr>
                      `
                      )
                      .join("")
                  : ""
              }
            </tbody>
          </table>
        </body>
      </html>
    `;

    // Use Puppeteer with chrome-aws-lambda to generate the PDF
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });
    await browser.close();

    // Upload the PDF to Supabase
    const { error: uploadError } = await supabase.storage
      .from("mas-walker-file")
      .upload(uniqueFileName, pdfBuffer, { contentType: "application/pdf" });

    if (uploadError) {
      throw new Error("Failed to upload file to Supabase");
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("mas-walker-file")
      .getPublicUrl(uniqueFileName);

    if (!publicUrlData || !publicUrlData.publicUrl) {
      throw new Error("Failed to generate public URL for the uploaded file");
    }

    return successResponse(
      { filePath: publicUrlData.publicUrl },
      "PDF file has been created and uploaded"
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return errorResponse("Failed to process request", 500);
  }
}
