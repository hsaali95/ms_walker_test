import bcrypt from "bcryptjs";
import { BUCKET, saltRounds } from "./constant";
import moment from "moment";
import dayjs from "dayjs";
import { getCookies } from "./cookies";
import client from "@/db/config/AWS";
import fs from "fs";
import { ObjectCannedACL, PutObjectCommand } from "@aws-sdk/client-s3";
import imageCompression from "browser-image-compression";
import axios from "axios";

export const hashPassword = (plainText: string): Promise<string> => {
  return bcrypt.hash(plainText, saltRounds);
};

export const helper = {
  toNumber: (val: string) => {
    if (val) {
      const parsedValue = parseFloat(val);
      if (isNaN(parsedValue)) {
        throw new Error("Invalid number");
      }
      return parsedValue;
    }
    return "";
  },
  convertFileToBase64: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  },

  getCompressedBase64: async (file: File): Promise<string> => {
    const imageFile = file;

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    const compressedFile = await imageCompression(imageFile, options);

    const base64 = await helper.convertFileToBase64(compressedFile);
    return base64;
  },
  getCompressedBase64FromFileUrl: async (
    url: string,
    filename: string
  ): Promise<string> => {
    let image = await axios.get(url, {
      responseType: "arraybuffer",
    });
    let returnedB64 = Buffer.from(image.data).toString("base64");
    const imageFile = await imageCompression.getFilefromDataUrl(
      returnedB64,
      filename
    );
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    const compressedFile = await imageCompression(imageFile, options);
    const base64 = await helper.convertFileToBase64(compressedFile);
    return base64;
  },
  getFormattedTime: () => {
    return moment().format("DD/MM/YYYY hh:mm a");
  },
  formatDate: (input: any): null | any => {
    return dayjs(input).format("DD/MM/YYYY");
  },
  formatDateTime: (input: any): null | any => {
    return dayjs(input).format("DD/MM/YYYY hh:mm a");
  },
  formatTime: (input: any): null | any => {
    return input ? moment.utc(input, "HH:mm:ss").format("hh:mm A") : null;
  },
  wrapInQuotes: (value: string | undefined | null) => {
    return `"${value || "-"}"`;
  },
  dateSendToDb: (data: string | any) => {
    return data ? dayjs(data).format("DD/MM/YYYY") : null;
  },
  extractTimeFromDateAndTime: (data: string | any) => {
    return data ? dayjs(data).format("HH:mm:ss") : null;
  },
};
export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}
export const getUserData = async () => {
  const cookies: any = await getCookies();
  return { ...cookies, user: JSON.parse(cookies.user) };
};

export function formatImageLinks(surveyFiles: any, imageBaseUrl: any) {
  if (Array.isArray(surveyFiles) && surveyFiles.length > 0) {
    const links = surveyFiles
      .map((data) => {
        if (data?.file?.path) {
          const fullUrl = imageBaseUrl + data.file.path;
          console.log("Generated Image URL:", fullUrl); // Log the generated URL
          return `=HYPERLINK("${fullUrl}")`; // Wrap the URL in quotes
        }
        return "-";
      })
      .join(" | ");

    return helper.wrapInQuotes(links);
  }
  return helper.wrapInQuotes("-");
}

export const uploadFile = (
  key: string,
  buffer: Buffer<any> | fs.ReadStream
) => {
  return client.send(
    new PutObjectCommand({
      ACL: ObjectCannedACL.public_read,
      Bucket: BUCKET,
      Key: "survey-images/" + key,
      Body: buffer,
    })
  );
};
