import api from "@/lib/api";
import axios, { AxiosError } from "axios";

export type Course = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  isPublished: boolean;
  category: {
    id: string;
    name: string;
  };
  speaker: {
    id: string;
    name: string;
  };
  lessons: unknown[]; // Array of lesson objects (structure not specified yet)
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

export const CourseService = {
  async getAll(): Promise<Course[]> {
    try {
      const response = await api.get("/course");
      return response.data || [];
    } catch (error) {
      console.error("[CourseService.getAll] failed", error);
      rethrowApiError(error, "Failed to fetch courses");
    }
  },
};

