import api from "@/lib/api";
import axios, { AxiosError } from "axios";

export type ContentItem = {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string | null;
  audioUrl: string;
  duration: string | null;
  isPublished: boolean | null;
  isFeatured: boolean;
  playCount: number;
  category: {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    slug: string;
    imageUrl: string | null;
    description: string;
  };
  speaker: {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    bio: string;
    address: string;
    image: string | null;
  };
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

export type CategoryPreview = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string | null;
  count?: number | string;
};

export type Speaker = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  bio: string;
  address: string;
  image: string | null;
};

export type Category = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  description: string;
};

export type ContentFilters = {
  categoryId?: string;
  speakerId?: string;
  limit?: number;
};

export const ContentService = {
  async getFeatured(): Promise<ContentItem[]> {
    try {
      const response = await api.get("/content/featured");
      return response.data;
    } catch (error) {
      console.error("[ContentService.getFeatured] failed", error);
      rethrowApiError(error, "Failed to fetch featured content");
    }
  },

  async getCategoryPreview(): Promise<CategoryPreview[]> {
    try {
      const response = await api.get("/category/preview");
      return response.data;
    } catch (error) {
      console.error("[ContentService.getCategoryPreview] failed", error);
      rethrowApiError(error, "Failed to fetch category preview");
    }
  },

  async getAll(filters?: ContentFilters): Promise<ContentItem[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.categoryId) {
        params.append("categoryId", filters.categoryId);
      }
      if (filters?.speakerId) {
        params.append("speakerId", filters.speakerId);
      }
      if (filters?.limit) {
        params.append("limit", filters.limit.toString());
      }
      const queryString = params.toString();
      const url = `/content${queryString ? `?${queryString}` : ""}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error("[ContentService.getAll] failed", error);
      rethrowApiError(error, "Failed to fetch content");
    }
  },

  async getAllCategories(): Promise<Category[]> {
    try {
      const response = await api.get("/category");
      return response.data;
    } catch (error) {
      console.error("[ContentService.getAllCategories] failed", error);
      rethrowApiError(error, "Failed to fetch categories");
    }
  },

  async getAllSpeakers(): Promise<Speaker[]> {
    try {
      const response = await api.get("/speaker");
      return response.data;
    } catch (error) {
      console.error("[ContentService.getAllSpeakers] failed", error);
      rethrowApiError(error, "Failed to fetch speakers");
    }
  },

  async search(query: string): Promise<ContentItem[]> {
    try {
      const response = await api.get(`/content/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error("[ContentService.search] failed", error);
      rethrowApiError(error, "Failed to search content");
    }
  },

  async getRecentSearches(limit: number = 10): Promise<string[]> {
    try {
      const response = await api.get(`/content/recent-searches?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error("[ContentService.getRecentSearches] failed", error);
      rethrowApiError(error, "Failed to fetch recent searches");
    }
  },

  async getPopular(limit: number = 20): Promise<ContentItem[]> {
    try {
      const response = await api.get(`/content/popular?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error("[ContentService.getPopular] failed", error);
      rethrowApiError(error, "Failed to fetch popular content");
    }
  },

  async getTrending(limit: number = 8): Promise<ContentItem[]> {
    try {
      const response = await api.get(`/content/trending?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error("[ContentService.getTrending] failed", error);
      rethrowApiError(error, "Failed to fetch trending content");
    }
  },

  async getById(id: string): Promise<ContentItem> {
    try {
      const response = await api.get(`/content/${id}`);
      return response.data;
    } catch (error) {
      console.error("[ContentService.getById] failed", error);
      rethrowApiError(error, "Failed to fetch content");
    }
  },

};
