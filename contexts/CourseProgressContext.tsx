"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface CourseProgressContextType {
  isLessonComplete: (courseId: string | number, lessonId: string | number) => boolean;
  getCourseProgress: (courseId: string | number, totalLessons: number) => number;
  markLessonComplete: (courseId: string | number, lessonId: string | number) => void;
  markLessonIncomplete: (courseId: string | number, lessonId: string | number) => void;
}

const CourseProgressContext = createContext<CourseProgressContextType | undefined>(undefined);

export function CourseProgressProvider({ children }: { children: ReactNode }) {
  // Store completed lessons as "courseId-lessonId" keys
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const getLessonKey = useCallback((courseId: string | number, lessonId: string | number) => {
    return `${courseId}-${lessonId}`;
  }, []);

  const isLessonComplete = useCallback(
    (courseId: string | number, lessonId: string | number) => {
      return completedLessons.has(getLessonKey(courseId, lessonId));
    },
    [completedLessons, getLessonKey]
  );

  const getCourseProgress = useCallback(
    (courseId: string | number, totalLessons: number) => {
      if (totalLessons === 0) return 0;
      
      let completedCount = 0;
      // For API courses with string IDs, we need to check all lessons in the array
      // For now, we'll iterate through lesson indices (1-based for backward compatibility)
      for (let i = 1; i <= totalLessons; i++) {
        if (isLessonComplete(courseId, i)) {
          completedCount++;
        }
      }
      
      return Math.round((completedCount / totalLessons) * 100);
    },
    [isLessonComplete]
  );

  const markLessonComplete = useCallback(
    (courseId: string | number, lessonId: string | number) => {
      setCompletedLessons((prev) => {
        const next = new Set(prev);
        next.add(getLessonKey(courseId, lessonId));
        return next;
      });
    },
    [getLessonKey]
  );

  const markLessonIncomplete = useCallback(
    (courseId: string | number, lessonId: string | number) => {
      setCompletedLessons((prev) => {
        const next = new Set(prev);
        next.delete(getLessonKey(courseId, lessonId));
        return next;
      });
    },
    [getLessonKey]
  );

  return (
    <CourseProgressContext.Provider
      value={{
        isLessonComplete,
        getCourseProgress,
        markLessonComplete,
        markLessonIncomplete,
      }}
    >
      {children}
    </CourseProgressContext.Provider>
  );
}

export function useCourseProgress() {
  const context = useContext(CourseProgressContext);
  if (context === undefined) {
    throw new Error("useCourseProgress must be used within a CourseProgressProvider");
  }
  return context;
}
