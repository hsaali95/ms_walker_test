"use client";
import axiosInstance from "@/services/http/http-instance";
import errorMessages from "@/utils/error-messages";
import { responseHandler } from "@/utils/response-handler";
import React, { useLayoutEffect } from "react";
import { Toaster } from "../components/snackbar";
import { deleteCookies } from "@/utils/cookies";
export type TCookies = {
  [key: string]: string;
};
type propsType = {
  children: React.ReactNode;
};

const AxiosInterceptorProvider = ({ children }: propsType) => {
  useLayoutEffect(() => {
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        // in case of cancelled error or with no status code neglect that error and show no toaster
        if (!error.code || error.code === "ERR_CANCELED") {
          return Promise.reject(error);
        }
        const status = error?.response?.status;

        const errorMessage =
          responseHandler(error?.response) || errorMessages(status);
        Toaster("error", errorMessage);
        if (status === 401) {
          deleteCookies("/login");
        }
        console.log("error", error);
        return Promise.reject(errorMessage);
      }
    );
    return () => {
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return <>{children}</>;
};

export default AxiosInterceptorProvider;
