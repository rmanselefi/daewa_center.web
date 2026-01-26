import api from "@/lib/api";
import axios, { AxiosError } from "axios";

export type UserResponse = {
  id: string;
  email?: string | null;
  fullname?: string | null;
  photoURL?: string | null;
  profile?: Record<string, unknown> | null;
};

export type CreateUserReq = {
  email: string;
  password: string;
  fullname: string;
};

export type UserStats = {
  lecturesCompleted: number;
  totalTimeHours: number;
  totalTimeFormatted: string;
  playlistsCount: number;
};

type ApiErrorData = { message?: string };

function rethrowApiError(error: unknown, fallbackMessage: string): never {
  // Preserve AxiosError so callers can read error.response?.data?.message, status, etc.
  if (axios.isAxiosError<ApiErrorData>(error)) {
    throw error as AxiosError<ApiErrorData>;
  }

  if (error instanceof Error) {
    throw error;
  }

  throw new Error(fallbackMessage);
}

export const AuthService = {
  async login(email: string, password: string) {
    try {
      const response = await api.post("/api/v1/auth/login", { email, password });
      return response.data;
    } catch (error) {
      console.error("[AuthService.login] failed", error);
      rethrowApiError(error, "Failed to login");
    }
  },

  async LogOut() {
    try {
      const response = await api.post("/api/v1/auth/logout");
      return response.data;
    } catch (error) {
      console.error("[AuthService.LogOut] failed", error);
      rethrowApiError(error, "Failed to logout");
    }
  },

  async getUserMe(): Promise<UserResponse | null> {
    try {
      const response = await api.get("/api/v1/auth/me");
      return response.data;
    } catch (error) {
      // 401 is expected when user is not logged in, return null instead of throwing
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return null;
      }
      // Handle network errors (API down, no connection, timeout, etc.)
      // Network errors don't have a response object, they have error.request instead
      if (
        axios.isAxiosError(error) &&
        (!error.response && error.request) &&
        (error.code === "ERR_NETWORK" ||
          error.code === "ECONNABORTED" ||
          error.code === "ETIMEDOUT" ||
          error.message?.toLowerCase().includes("network error"))
      ) {
        console.warn("[AuthService.getUserMe] Network error - API may be down", error.message);
        return null; // Return null for network errors, same as 401
      }
      // Only log other errors
      console.error("[AuthService.getUserMe] failed", error);
      rethrowApiError(error, "Failed to fetch user");
    }
  },

  async createUser({ email, password, fullname }: CreateUserReq) {
    try {
      const response = await api.post("/api/v1/user", { email, password, fullname });
      return response.data;
    } catch (error) {
      console.error("[AuthService.createUser] failed", error);
      rethrowApiError(error, "Failed to create user");
    }
  },

  async getUserStats(): Promise<UserStats> {
    try {
      const response = await api.get("/api/v1/user/me/stats");
      return response.data;
    } catch (error) {
      console.error("[AuthService.getUserStats] failed", error);
      rethrowApiError(error, "Failed to fetch user stats");
    }
  },
};
