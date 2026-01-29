"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LessonProgressService, UpdateLessonProgressReq } from "@/services/lessonProgress.service";
import { COURSE_KEYS } from "./useCourse";

export function useUpdateLessonProgress() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateLessonProgressReq }) =>
      LessonProgressService.updateProgress(userId, data),
    onSuccess: (_, variables) => {
      // Invalidate lessons with progress to refresh the data
      // We need the courseId, but we can invalidate all course queries
      qc.invalidateQueries({ queryKey: COURSE_KEYS.all });
    },
    onError: (error: any) => {
      console.error("Failed to update lesson progress:", error);
      // Don't show toast for progress updates to avoid spam
    },
  });
}
