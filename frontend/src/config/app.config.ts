import { QueryClientConfig } from "@tanstack/react-query";
import { notification } from "antd";
import { isAxiosError } from "axios";

export const QUERY_CONFIG: QueryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1 * 60 * 1000, // 1 Minute
      retry: (failureCount, error: any) => {
        const statusCode = error?.response?.status;

        if (statusCode === 401) return false;

        return true;
      },
    },
    mutations: {
      onError: (error) => {
        if (isAxiosError(error)) {
          const data = error.response?.data;
          const errorsList = data?.errors;
          let description = "";

          if (Array.isArray(errorsList)) {
            description = errorsList
              .map((el: any) => `${el?.name}: ${el?.errors?.join(",")}`)
              .join("\n");
          } else if (errorsList) {
            description = Object.keys(errorsList)
              .map((el) => `${el}: ${errorsList[el]?.join(",")}`)
              .join("\n");
          }

          notification.error({
            message: data?.message,
            description,
            placement: "top",
          });
        }
      },
    },
  },
};
