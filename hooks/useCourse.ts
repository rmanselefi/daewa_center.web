"use client";

import { useQuery } from "@tanstack/react-query";
import { CourseService, Course } from "@/services/course.service";

export const COURSE_KEYS = {
  all: ["course"] as const,
  list: () => [...COURSE_KEYS.all, "list"] as const,
  byId: (id: string) => [...COURSE_KEYS.all, "byId", id] as const,
};

export function useCourses() {
  return useQuery<Course[]>({
    queryKey: COURSE_KEYS.list(),
    queryFn: async () => {
      try {
        const response = await CourseService.getAll();
        return response || [];
      } catch (error) {
        console.error("getAll courses error:", error);
        throw error;
      }
    },
    retry: false,
  });
}

