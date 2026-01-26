import api from "@/lib/api";
import axios, { AxiosError } from "axios";
import { ContentItem } from "./content.service";

type ApiErrorData = { message?: string };

function rethrowApiError(error: unknown, fallbackMessage: string): never {
  if (axios.isAxiosError<ApiErrorData>(error)) {
    throw error as AxiosError<ApiErrorData>;
  }

  if (error instanceof Error) {
    throw error;
  }

  throw new Error(fallbackMessage);
}

export const PlayHistoryService = {
  async getRecentlyPlayed(limit?: number): Promise<ContentItem[]> {
    try {
      const params = limit ? `?limit=${limit}` : "";
      const response = await api.get(`/play-history/recently-played${params}`);
      return response.data || [];
    } catch (error) {
      console.error("[PlayHistoryService.getRecentlyPlayed] failed", error);
      rethrowApiError(error, "Failed to fetch recently played content");
    }
  },
};

