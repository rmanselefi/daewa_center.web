"use client";

import { useQuery } from "@tanstack/react-query";
import { PlayHistoryService } from "@/services/playHistory.service";
import { ContentItem } from "@/services/content.service";

export const PLAY_HISTORY_KEYS = {
  all: ["playHistory"] as const,
  recentlyPlayed: (limit?: number) => [...PLAY_HISTORY_KEYS.all, "recentlyPlayed", limit] as const,
};

export function useRecentlyPlayed(limit?: number, enabled: boolean = true) {
  return useQuery<ContentItem[]>({
    queryKey: PLAY_HISTORY_KEYS.recentlyPlayed(limit),
    queryFn: async () => {
      try {
        const response = await PlayHistoryService.getRecentlyPlayed(limit);
        return response || [];
      } catch (error) {
        console.error("getRecentlyPlayed error:", error);
        throw error;
      }
    },
    enabled,
    retry: false,
  });
}

