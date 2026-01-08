"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  PlaylistService,
  Playlist,
  CreatePlaylistReq,
} from "@/services/playlist.service";
import { toast } from "sonner";

export const PLAYLIST_KEYS = {
  all: ["playlists"] as const,
  lists: () => [...PLAYLIST_KEYS.all, "list"] as const,
  list: () => [...PLAYLIST_KEYS.lists()] as const,
  details: () => [...PLAYLIST_KEYS.all, "detail"] as const,
  detail: (id: string) => [...PLAYLIST_KEYS.details(), id] as const,
};

export function usePlaylists() {
  return useQuery<Playlist[]>({
    queryKey: PLAYLIST_KEYS.list(),
    queryFn: async () => {
      try {
        const response = await PlaylistService.getAll();
        return response || [];
      } catch (error) {
        console.error("getAll playlists error:", error);
        throw error;
      }
    },
    retry: false,
  });
}

export function usePlaylist(id: string) {
  return useQuery<Playlist>({
    queryKey: PLAYLIST_KEYS.detail(id),
    queryFn: async () => {
      try {
        const response = await PlaylistService.getById(id);
        return response;
      } catch (error) {
        console.error("getPlaylist error:", error);
        throw error;
      }
    },
    enabled: !!id,
    retry: false,
  });
}

export function useCreatePlaylist() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePlaylistReq) => PlaylistService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PLAYLIST_KEYS.list() });
      toast.success("Playlist created successfully");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to create playlist";
      toast.error(message);
    },
  });
}

export function useUpdatePlaylist() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreatePlaylistReq> }) =>
      PlaylistService.update(id, data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: PLAYLIST_KEYS.list() });
      qc.invalidateQueries({ queryKey: PLAYLIST_KEYS.detail(variables.id) });
      toast.success("Playlist updated successfully");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to update playlist";
      toast.error(message);
    },
  });
}

export function useDeletePlaylist() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => PlaylistService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PLAYLIST_KEYS.list() });
      toast.success("Playlist deleted successfully");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to delete playlist";
      toast.error(message);
    },
  });
}

export function useAddContentToPlaylist() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ playlistId, contentId }: { playlistId: string; contentId: string }) =>
      PlaylistService.addContent(playlistId, contentId),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: PLAYLIST_KEYS.list() });
      qc.invalidateQueries({ queryKey: PLAYLIST_KEYS.detail(variables.playlistId) });
      toast.success("Content added to playlist");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to add content to playlist";
      toast.error(message);
    },
  });
}

export function useRemoveContentFromPlaylist() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ playlistId, contentId }: { playlistId: string; contentId: string }) =>
      PlaylistService.removeContent(playlistId, contentId),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: PLAYLIST_KEYS.list() });
      qc.invalidateQueries({ queryKey: PLAYLIST_KEYS.detail(variables.playlistId) });
      toast.success("Content removed from playlist");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to remove content from playlist";
      toast.error(message);
    },
  });
}

