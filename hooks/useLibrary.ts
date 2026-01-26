"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  LibraryService,
  LibraryItem,
  CheckLibraryStatusResponse,
} from "@/services/library.service";
import { ContentItem } from "@/services/content.service";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const LIBRARY_KEYS = {
  all: ["library"] as const,
  lists: () => [...LIBRARY_KEYS.all, "list"] as const,
  list: () => [...LIBRARY_KEYS.lists()] as const,
  content: () => [...LIBRARY_KEYS.all, "content"] as const,
  status: (contentId: string) => [...LIBRARY_KEYS.all, "status", contentId] as const,
};

export function useLibrary(enabled: boolean = true) {
  return useQuery<LibraryItem[]>({
    queryKey: LIBRARY_KEYS.list(),
    queryFn: async () => {
      try {
        const response = await LibraryService.getAll();
        return response || [];
      } catch (error) {
        console.error("getAll library error:", error);
        throw error;
      }
    },
    enabled,
    retry: false,
  });
}

export function useLibraryContent(enabled: boolean = true) {
  return useQuery<ContentItem[]>({
    queryKey: LIBRARY_KEYS.content(),
    queryFn: async () => {
      try {
        const response = await LibraryService.getContent();
        return response || [];
      } catch (error) {
        console.error("getLibraryContent error:", error);
        throw error;
      }
    },
    enabled,
    retry: false,
  });
}

export function useCheckLibraryStatus(contentId: string | undefined, enabled: boolean = true) {
  return useQuery<CheckLibraryStatusResponse>({
    queryKey: LIBRARY_KEYS.status(contentId || ""),
    queryFn: async () => {
      if (!contentId) {
        return { isInLibrary: false };
      }
      try {
        const response = await LibraryService.checkStatus(contentId);
        return response;
      } catch (error) {
        console.error("checkLibraryStatus error:", error);
        // Return false on error to avoid blocking UI
        return { isInLibrary: false };
      }
    },
    enabled: enabled && !!contentId,
    retry: false,
  });
}

export function useAddToLibrary() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (contentId: string) => LibraryService.addContent(contentId),
    onSuccess: (_, contentId) => {
      qc.invalidateQueries({ queryKey: LIBRARY_KEYS.list() });
      qc.invalidateQueries({ queryKey: LIBRARY_KEYS.content() });
      qc.invalidateQueries({ queryKey: LIBRARY_KEYS.status(contentId) });
      toast.success("Added to library");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Failed to add to library";
      toast.error(message);
    },
  });
}

export function useRemoveFromLibrary() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (contentId: string) => LibraryService.removeContent(contentId),
    onSuccess: (_, contentId) => {
      qc.invalidateQueries({ queryKey: LIBRARY_KEYS.list() });
      qc.invalidateQueries({ queryKey: LIBRARY_KEYS.content() });
      qc.invalidateQueries({ queryKey: LIBRARY_KEYS.status(contentId) });
      toast.success("Removed from library");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Failed to remove from library";
      toast.error(message);
    },
  });
}

