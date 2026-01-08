import api from "@/lib/api";
import axios, { AxiosError } from "axios";
import { createSlug } from "@/lib/utils";

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
  // Slug is generated from title on the frontend if not provided by API
  slug?: string;
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
  category?: string; // UUID of category
  speaker?: string; // UUID of speaker
  search?: string;
  page?: number;
  limit?: number;
};

export type ContentResponse = {
  data: ContentItem[];
  meta: {
    total: number;
    page: number;
    limit: string | number;
    totalPages: number;
  };
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

  async getAll(filters?: ContentFilters): Promise<ContentResponse> {
    try {
      const params = new URLSearchParams();
      if (filters?.category) {
        params.append("category", filters.category);
      }
      if (filters?.speaker) {
        params.append("speaker", filters.speaker);
      }
      if (filters?.search) {
        params.append("search", filters.search);
      }
      if (filters?.page) {
        params.append("page", filters.page.toString());
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

  async getBySlug(slug: string): Promise<ContentItem> {
    // Find the UUID that corresponds to this slug by searching through content
    // Then use getById with the UUID to fetch the content (API always uses UUID)
    
    // Fetch content to find the matching slug and get its UUID
    const searchResponse = await api.get(`/content?limit=100`);
    const contentList = searchResponse.data?.data || searchResponse.data || [];
    
    // Find content by matching generated slug
    let found = contentList.find((item: ContentItem) => {
      const itemSlug = item.slug || createSlug(item.title);
      return itemSlug === slug;
    });
    
    // If not found in first page, search through more pages
    if (!found) {
      let page = 2;
      while (page <= 10) { // Limit to 10 pages to avoid infinite loops
        try {
          const pageResponse = await api.get(`/content?page=${page}&limit=100`);
          const pageContentList = pageResponse.data?.data || pageResponse.data || [];
          if (!pageContentList || pageContentList.length === 0) break;
          
          found = pageContentList.find((item: ContentItem) => {
            const itemSlug = item.slug || createSlug(item.title);
            return itemSlug === slug;
          });
          
          if (found) break;
          page++;
        } catch (pageError) {
          break;
        }
      }
    }
    
    if (!found) {
      throw new Error("Content not found");
    }
    
    // Now use the UUID to fetch the content (API always uses UUID)
    return this.getById(found.id);
  },

};
