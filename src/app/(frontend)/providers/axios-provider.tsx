// "use client";
// import axiosInstance from "@/services/http/http-instance";
// import errorMessages from "@/utils/error-messages";
// import { responseHandler } from "@/utils/response-handler";
// import React, { useLayoutEffect } from "react";
// import { Toaster } from "../components/snackbar";
// import { deleteCookies } from "@/utils/cookies";
// export type TCookies = {
//   [key: string]: string;
// };
// type propsType = {
//   children: React.ReactNode;
// };

// const AxiosInterceptorProvider = ({ children }: propsType) => {
//   useLayoutEffect(() => {
//     const responseInterceptor = axiosInstance.interceptors.response.use(
//       (response) => response,
//       async (error) => {
//         // in case of cancelled error or with no status code neglect that error and show no toaster
//         if (!error.code || error.code === "ERR_CANCELED") {
//           return Promise.reject(error);
//         }
//         const status = error?.response?.status;

//         const errorMessage =
//         responseHandler(error?.response) || errorMessages(status);
//         console.log("*********error*********", error);
//         console.log("*********errorMessage*********", errorMessage);
//         Toaster("error", errorMessage);
//         if (status === 401) {
//           deleteCookies("/login");
//         }
//         return Promise.reject(errorMessage);
//       }
//     );
//     return () => {
//       axiosInstance.interceptors.response.eject(responseInterceptor);
//     };
//   }, []);

//   return <>{children}</>;
// };

// export default AxiosInterceptorProvider;

"use client";

import axiosInstance from "@/services/http/http-instance";
import errorMessages from "@/utils/error-messages";
import { responseHandler } from "@/utils/response-handler";
import React, { useLayoutEffect } from "react";
import { Toaster } from "../components/snackbar";
import { deleteCookies } from "@/utils/cookies";

type propsType = {
  children: React.ReactNode;
};

let hasFirst401Occurred = false;

const AxiosInterceptorProvider = ({ children }: propsType) => {
  useLayoutEffect(() => {
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (!error.code || error.code === "ERR_CANCELED") {
          return Promise.reject(error);
        }

        const status = error?.response?.status;

        if (status === 401) {
          if (hasFirst401Occurred) {
            // Prevent second 401 from proceeding - just cancel it silently
            console.warn("Second 401 blocked");

            return Promise.reject(); // Or use custom message: Promise.reject("401 Blocked");
          }

          hasFirst401Occurred = true;

          const errorMessage =
            responseHandler(error?.response) || errorMessages(status);

          console.log("*********401 error*********", errorMessage);

          Toaster("error", errorMessage);
          deleteCookies("/login")
            .then(() => {
              setTimeout(() => {
                location.reload();
              }, 5000);
            })
            .catch((error) => {
              console.log("error", error);
            });

          return Promise.reject(errorMessage);
        }

        const errorMessage =
          responseHandler(error?.response) || errorMessages(status);

        Toaster("error", errorMessage);
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
