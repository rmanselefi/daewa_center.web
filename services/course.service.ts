import api from "@/lib/api";
import axios, { AxiosError } from "axios";
import { createSlug } from "@/lib/utils";

export type Lesson = {
  id: string;
  createdAt: string;
  updatedAt: string;
  contentUrl: string;
  lessonTitle: string;
  orderIndex: number;
  isPreview: boolean;
};

export type LessonProgress = {
  listenedSeconds: number;
  isCompleted: boolean;
  lastListenedAt: string | null;
};

export type LessonWithProgress = {
  id: string;
  lessonTitle: string;
  contentUrl: string;
  orderIndex: number;
  isPreview: boolean;
  createdAt: string;
  updatedAt: string;
  progress: LessonProgress;
  /** Duration in seconds (int), when provided by API. May be number or string. */
  duration?: number | string;
};

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
  lessons: Lesson[];
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

  async getById(id: string): Promise<Course> {
    try {
      const response = await api.get(`/course/${id}`);
      return response.data;
    } catch (error) {
      console.error("[CourseService.getById] failed", error);
      rethrowApiError(error, "Failed to fetch course");
    }
  },

  async getBySlug(slug: string): Promise<Course> {
    // Find the UUID that corresponds to this slug by searching through courses
    // Then use getById with the UUID to fetch the course (API always uses UUID)
    
    // Fetch courses to find the matching slug and get its UUID
    const courses = await this.getAll();
    
    // Find course by matching generated slug
    const found = courses.find((course) => {
      const courseSlug = createSlug(course.title);
      return courseSlug === slug;
    });
    
    if (!found) {
      throw new Error("Course not found");
    }
    
    // Now use the UUID to fetch the course (API always uses UUID)
    return this.getById(found.id);
  },

  async getLessonsWithProgress(courseId: string): Promise<LessonWithProgress[]> {
    try {
      const response = await api.get(`/course-lesson/course/${courseId}/with-progress`);
      return response.data || [];
    } catch (error) {
      console.error("[CourseService.getLessonsWithProgress] failed", error);
      rethrowApiError(error, "Failed to fetch lessons with progress");
    }
  },
};

