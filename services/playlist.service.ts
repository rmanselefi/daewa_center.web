import api from "@/lib/api";
import axios, { AxiosError } from "axios";

export type Playlist = {
  id: string;
  name: string;
  description?: string | null;
  isPublic?: boolean;
  items: any[]; // Array of content items in the playlist
  createdAt?: string;
  updatedAt?: string;
};

export type CreatePlaylistReq = {
  name: string;
  description?: string;
};

export type AddContentToPlaylistReq = {
  contentId: string;
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

export const PlaylistService = {
  async getAll(): Promise<Playlist[]> {
    try {
      const response = await api.get("/playlist");
      return response.data || [];
    } catch (error) {
      console.error("[PlaylistService.getAll] failed", error);
      rethrowApiError(error, "Failed to fetch playlists");
    }
  },

  async getById(id: string): Promise<Playlist> {
    try {
      const response = await api.get(`/playlist/${id}`);
      return response.data;
    } catch (error) {
      console.error("[PlaylistService.getById] failed", error);
      rethrowApiError(error, "Failed to fetch playlist");
    }
  },

  async create(data: CreatePlaylistReq): Promise<Playlist> {
    try {
      const response = await api.post("/playlist", data);
      return response.data;
    } catch (error) {
      console.error("[PlaylistService.create] failed", error);
      rethrowApiError(error, "Failed to create playlist");
    }
  },

  async update(id: string, data: Partial<CreatePlaylistReq>): Promise<Playlist> {
    try {
      const response = await api.patch(`/playlist/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("[PlaylistService.update] failed", error);
      rethrowApiError(error, "Failed to update playlist");
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/playlist/${id}`);
    } catch (error) {
      console.error("[PlaylistService.delete] failed", error);
      rethrowApiError(error, "Failed to delete playlist");
    }
  },

  async addContent(playlistId: string, contentId: string): Promise<void> {
    try {
      await api.post(`/playlist/${playlistId}/content`, { contentId });
    } catch (error) {
      console.error("[PlaylistService.addContent] failed", error);
      rethrowApiError(error, "Failed to add content to playlist");
    }
  },

  async removeContent(playlistId: string, contentId: string): Promise<void> {
    try {
      await api.delete(`/playlist/${playlistId}/content/${contentId}`);
    } catch (error) {
      console.error("[PlaylistService.removeContent] failed", error);
      rethrowApiError(error, "Failed to remove content from playlist");
    }
  },
};

