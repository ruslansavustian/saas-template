import { AxiosError } from "axios";

export interface ApiErrorResponse {
  message?: string;
  error?: string;
  statusCode?: number;
}

export const handleApiError = (error: unknown): string => {
  const axiosError = error as AxiosError<ApiErrorResponse>;

  if (axiosError.response?.data) {
    return (
      axiosError.response.data.message ||
      axiosError.response.data.error ||
      `Server error: ${axiosError.response.status}`
    );
  }

  if (axiosError.request) {
    return "Network error: No response from server";
  }

  if (axiosError.message) {
    return `Request error: ${axiosError.message}`;
  }

  return "An unexpected error occurred";
};
