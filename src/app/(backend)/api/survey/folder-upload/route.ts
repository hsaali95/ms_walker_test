import { errorResponse, successResponse } from "@/utils/response.decorator";
import {
  DeleteObjectCommand,
  ListObjectsV2Command,
  ObjectCannedACL,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { BUCKET } from "@/utils/constant";
import client from "@/db/config/AWS";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

export const POST = async () => {
  try {
    const dirPath = path.resolve(process.cwd(), "public/uploads");
    const files = fs.readdirSync(dirPath);
    // const uploadFilePromise = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileStream = fs.createReadStream(path.join(dirPath + "/" + file));

      const uploadParams = {
        Bucket: BUCKET,
        Key: `survey-images/${file}`, // S3 object key
        Body: fileStream,
        ACL: ObjectCannedACL.public_read,
      };

      const command = new PutObjectCommand(uploadParams);
      await client.send(command);
      console.log(`progress: ${i + 1} / ${files.length}`);
    }

    return successResponse({}, "Folder uploaded successfully");
  } catch (error: any) {
    console.error("Failed to upload:", error);
    return errorResponse(error.message || "Failed to upload", 500);
  }
};

export const DELETE = async () => {
  try {
    const params = {
      Bucket: BUCKET,
      Marker: "",
    };
    const response = await client.send(new ListObjectsV2Command(params));
    const contents = response?.Contents || [];
    for (const content of contents) {
      const bucketParams = {
        Bucket: BUCKET,
        Key: content.Key,
      };
      await client.send(new DeleteObjectCommand(bucketParams));
    }

    return successResponse(response, "Folder uploaded successfully");
  } catch (error: any) {
    console.error("Failed to upload:", error);
    return errorResponse(error.message || "Failed to upload", 500);
  }
};

export const GET = async () => {
  try {
    const params = {
      Bucket: BUCKET,
      Marker: "",
    };
    const response = await client.send(new ListObjectsV2Command(params));
    const contents = response?.Contents || [];
    return successResponse(contents);
  } catch (error: any) {
    console.error("Failed to upload:", error);
    return errorResponse(error.message || "Failed to upload", 500);
  }
};
