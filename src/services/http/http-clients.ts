import { AxiosResponse } from "axios";
import axiosInstance from "./http-instance";
import { AxiosRequestConfig } from "axios";

export type TAPIClientProps<T> = {
  config: AxiosRequestConfig;
  data?: T;
};

export const apiClient = {
  request: <T>({ config }: TAPIClientProps<T>): Promise<AxiosResponse> =>
    axiosInstance(config),
};
