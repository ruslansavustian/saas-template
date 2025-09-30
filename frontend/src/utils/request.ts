import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

export const request: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",

  headers: {
    Accept: "application/json",
  },
});

request.interceptors.request.use(
  (request: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");

    if (token && !request.headers.Authorization) {
      request.headers.Authorization = `Bearer ${token}`;
    }

    return request;
  },
  (error: AxiosError) => Promise.reject(error)
);

request.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    console.log("Request error details:", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
    });
    return Promise.reject(error);
  }
);

export type { AxiosResponse, AxiosError };
