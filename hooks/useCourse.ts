"use client";

import { useQuery } from "@tanstack/react-query";
import { CourseService, Course, LessonWithProgress } from "@/services/course.service";

export const COURSE_KEYS = {
  all: ["course"] as const,
  list: () => [...COURSE_KEYS.all, "list"] as const,
  byId: (id: string) => [...COURSE_KEYS.all, "byId", id] as const,
  lessonsWithProgress: (courseId: string) => [...COURSE_KEYS.all, "lessonsWithProgress", courseId] as const,
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

export function useCourseById(id: string) {
  return useQuery<Course>({
    queryKey: COURSE_KEYS.byId(id),
    queryFn: async () => {
      try {
        const response = await CourseService.getById(id);
        return response;
      } catch (error) {
        console.error("getById course error:", error);
        throw error;
      }
    },
    enabled: !!id,
    retry: false,
  });
}

export function useCourseBySlug(slug: string) {
  return useQuery<Course>({
    queryKey: [...COURSE_KEYS.all, "bySlug", slug],
    queryFn: async () => {
      try {
        const response = await CourseService.getBySlug(slug);
        return response;
      } catch (error) {
        console.error("getBySlug course error:", error);
        throw error;
      }
    },
    enabled: !!slug,
    retry: false,
  });
}

export function useLessonsWithProgress(courseId: string, enabled: boolean = true) {
  return useQuery<LessonWithProgress[]>({
    queryKey: COURSE_KEYS.lessonsWithProgress(courseId),
    queryFn: async () => {
      try {
        const response = await CourseService.getLessonsWithProgress(courseId);
        return response || [];
      } catch (error) {
        console.error("getLessonsWithProgress error:", error);
        throw error;
      }
    },
    enabled: enabled && !!courseId,
    retry: false,
  });
}

