import api from "@/lib/api";
import axios, { AxiosError } from "axios";
import { ContentItem } from "./content.service";

export type LibraryItem = {
  id: string;
  contentId: string;
  content: ContentItem;
  createdAt: string;
  updatedAt: string;
};

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

export type AddToLibraryReq = {
  contentId: string;
};

export type CheckLibraryStatusResponse = {
  isInLibrary: boolean;
};

export const LibraryService = {
  async getAll(): Promise<LibraryItem[]> {
    try {
      const response = await api.get("/library");
      return response.data || [];
    } catch (error) {
      console.error("[LibraryService.getAll] failed", error);
      rethrowApiError(error, "Failed to fetch library items");
    }
  },

  async getContent(): Promise<ContentItem[]> {
    try {
      const response = await api.get("/library/content");
      return response.data || [];
    } catch (error) {
      console.error("[LibraryService.getContent] failed", error);
      rethrowApiError(error, "Failed to fetch library content");
    }
  },

  async addContent(contentId: string): Promise<LibraryItem> {
    try {
      const response = await api.post("/library/content", { contentId });
      return response.data;
    } catch (error) {
      console.error("[LibraryService.addContent] failed", error);
      rethrowApiError(error, "Failed to add content to library");
    }
  },

  async removeContent(contentId: string): Promise<void> {
    try {
      await api.delete(`/library/content/${contentId}`);
    } catch (error) {
      console.error("[LibraryService.removeContent] failed", error);
      rethrowApiError(error, "Failed to remove content from library");
    }
  },

  async checkStatus(contentId: string): Promise<CheckLibraryStatusResponse> {
    try {
      const response = await api.get(`/library/content/${contentId}/check`);
      return response.data;
    } catch (error) {
      console.error("[LibraryService.checkStatus] failed", error);
      rethrowApiError(error, "Failed to check library status");
    }
  },
};

