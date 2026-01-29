import api from "@/lib/api";
import axios, { AxiosError } from "axios";

export type UpdateLessonProgressReq = {
  courseLessonId: string;
  listenedSeconds?: number;
  isCompleted?: boolean;
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

export const LessonProgressService = {
  async updateProgress(userId: string, data: UpdateLessonProgressReq): Promise<void> {
    try {
      await api.put(`/user-lesson-progress/user/${userId}/lesson`, data);
    } catch (error) {
      console.error("[LessonProgressService.updateProgress] failed", error);
      rethrowApiError(error, "Failed to update lesson progress");
    }
  },
};
