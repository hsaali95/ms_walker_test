import { Toaster } from "@/app/(frontend)/components/snackbar";
import { AxiosResponse } from "axios";

type TResponse = {
  data: Array<any>[] | any;
  status: boolean;
  error: string;
  message?: string | undefined;
};

export const responseHandler = (response: AxiosResponse<TResponse>) => {
  if (response) {
    const APIResponse = response.data;
    if (APIResponse.status) {
      if (APIResponse?.message) {
        Toaster("success", APIResponse?.message || "");
      }
      // APIResponse?.message && Toaster("success", APIResponse?.message || "");
      return APIResponse.data;
    } else {
      return APIResponse.error;
    }
  } else {
    return null;
  }
};
