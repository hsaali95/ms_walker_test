import bcrypt from "bcryptjs";
import { saltRounds } from "./constant";
import moment from "moment";
import dayjs from "dayjs";
import { getCookies } from "./cookies";
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
    return dayjs(input).format("hh:mm a");
  },
  wrapInQuotes: (value: string | undefined | null) => {
    return `"${value || "-"}"`;
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
