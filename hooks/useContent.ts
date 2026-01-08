"use client";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { ContentService, ContentItem, CategoryPreview, Speaker, Category, ContentFilters, ContentResponse } from "@/services/content.service";

export const CONTENT_KEYS = {
  all: ["content"] as const,
  featured: () => [...CONTENT_KEYS.all, "featured"] as const,
  categoryPreview: () => [...CONTENT_KEYS.all, "categoryPreview"] as const,
  list: (filters?: ContentFilters) => [...CONTENT_KEYS.all, "list", filters] as const,
  categories: () => [...CONTENT_KEYS.all, "categories"] as const,
  speakers: () => [...CONTENT_KEYS.all, "speakers"] as const,
  search: (query: string) => [...CONTENT_KEYS.all, "search", query] as const,
  recentSearches: (limit: number) => [...CONTENT_KEYS.all, "recentSearches", limit] as const,
  popular: (limit: number) => [...CONTENT_KEYS.all, "popular", limit] as const,
  trending: (limit: number) => [...CONTENT_KEYS.all, "trending", limit] as const,
  byId: (id: string) => [...CONTENT_KEYS.all, "byId", id] as const,
};

export function useFeaturedContent() {
  return useQuery<ContentItem[]>({
    queryKey: CONTENT_KEYS.featured(),
    queryFn: async () => {
      try {
        const response = await ContentService.getFeatured();
        return response || [];
      } catch (error) {
        console.error("getFeatured error:", error);
        throw error;
      }
    },
    retry: false,
  });
}

export function useCategoryPreview() {
  return useQuery<CategoryPreview[]>({
    queryKey: CONTENT_KEYS.categoryPreview(),
    queryFn: async () => {
      try {
        const response = await ContentService.getCategoryPreview();
        return response || [];
      } catch (error) {
        console.error("getCategoryPreview error:", error);
        throw error;
      }
    },
    retry: false,
  });
}

export function useContent(filters?: ContentFilters) {
  return useQuery<ContentResponse>({
    queryKey: CONTENT_KEYS.list(filters),
    queryFn: async () => {
      try {
        const response = await ContentService.getAll(filters);
        return response || { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } };
      } catch (error) {
        console.error("getAll content error:", error);
        throw error;
      }
    },
    retry: false,
  });
}

export function useInfiniteContent(filters?: Omit<ContentFilters, "page">) {
  return useInfiniteQuery<ContentResponse>({
    queryKey: [...CONTENT_KEYS.list(filters), "infinite"],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const response = await ContentService.getAll({
          ...filters,
          page: pageParam as number,
        });
        return response || { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } };
      } catch (error) {
        console.error("getAll content error:", error);
        throw error;
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const currentPage = typeof lastPage.meta.page === "string" 
        ? parseInt(lastPage.meta.page) 
        : lastPage.meta.page;
      const totalPages = lastPage.meta.totalPages;
      
      if (currentPage < totalPages) {
        return currentPage + 1;
      }
      return undefined;
    },
    retry: false,
  });
}

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: CONTENT_KEYS.categories(),
    queryFn: async () => {
      try {
        const response = await ContentService.getAllCategories();
        return response || [];
      } catch (error) {
        console.error("getAllCategories error:", error);
        throw error;
      }
    },
    retry: false,
  });
}

export function useSpeakers() {
  return useQuery<Speaker[]>({
    queryKey: CONTENT_KEYS.speakers(),
    queryFn: async () => {
      try {
        const response = await ContentService.getAllSpeakers();
        return response || [];
      } catch (error) {
        console.error("getAllSpeakers error:", error);
        throw error;
      }
    },
    retry: false,
  });
}

export function useSearch(query: string) {
  return useQuery<ContentItem[]>({
    queryKey: CONTENT_KEYS.search(query),
    queryFn: async () => {
      try {
        if (!query.trim()) return [];
        const response = await ContentService.search(query);
        return response || [];
      } catch (error) {
        console.error("search error:", error);
        throw error;
      }
    },
    enabled: query.trim().length > 0,
    retry: false,
  });
}

export function useRecentSearches(limit: number = 10) {
  return useQuery<string[]>({
    queryKey: CONTENT_KEYS.recentSearches(limit),
    queryFn: async () => {
      try {
        const response = await ContentService.getRecentSearches(limit);
        return response || [];
      } catch (error) {
        console.error("getRecentSearches error:", error);
        throw error;
      }
    },
    retry: false,
  });
}

export function usePopularContent(limit: number = 20) {
  return useQuery<ContentItem[]>({
    queryKey: CONTENT_KEYS.popular(limit),
    queryFn: async () => {
      try {
        const response = await ContentService.getPopular(limit);
        return response || [];
      } catch (error) {
        console.error("getPopular error:", error);
        throw error;
      }
    },
    retry: false,
  });
}

export function useTrendingContent(limit: number = 8) {
  return useQuery<ContentItem[]>({
    queryKey: CONTENT_KEYS.trending(limit),
    queryFn: async () => {
      try {
        const response = await ContentService.getTrending(limit);
        return response || [];
      } catch (error) {
        console.error("getTrending error:", error);
        throw error;
      }
    },
    retry: false,
  });
}

export function useContentById(id: string) {
  return useQuery<ContentItem>({
    queryKey: CONTENT_KEYS.byId(id),
    queryFn: async () => {
      try {
        const response = await ContentService.getById(id);
        return response;
      } catch (error) {
        console.error("getById error:", error);
        throw error;
      }
    },
    enabled: !!id,
    retry: false,
  });
}

export function useContentBySlug(slug: string) {
  return useQuery<ContentItem>({
    queryKey: [...CONTENT_KEYS.all, "bySlug", slug],
    queryFn: async () => {
      try {
        const response = await ContentService.getBySlug(slug);
        return response;
      } catch (error) {
        console.error("getBySlug error:", error);
        throw error;
      }
    },
    enabled: !!slug,
    retry: false,
  });
}

