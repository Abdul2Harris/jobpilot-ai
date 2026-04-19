import axios, { AxiosRequestConfig } from "axios";
import { createClient } from "@/lib/supabase/client";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercept every request and attach token
apiClient.interceptors.request.use(async (config) => {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }

  return config;
});

// Intercept responses to handle auth errors globally
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // ✅ Only redirect if not already on login/signup/onboarding
    const publicPaths = ["/login", "/signup", "/onboarding"];
    const isPublicPath = publicPaths.some((path) =>
      window.location.pathname.startsWith(path),
    );

    if (error.response?.status === 401 && !isPublicPath) {
      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Unwrap axios response once here so queries dont need .then(r => r.data)
const apiRequest = (config: AxiosRequestConfig) =>
  apiClient(config).then((res) => res.data);

type RequestConfig = Omit<AxiosRequestConfig, "method">;

export const GET = (config: RequestConfig) =>
  apiRequest({ method: "GET", ...config });

export const POST = (config: RequestConfig) =>
  apiRequest({ method: "POST", ...config });

export const PATCH = (config: RequestConfig) =>
  apiRequest({ method: "PATCH", ...config });

export const DELETE = (config: RequestConfig) =>
  apiRequest({ method: "DELETE", ...config });
