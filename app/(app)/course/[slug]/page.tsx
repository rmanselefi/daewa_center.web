"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, BookOpen, Play, CheckCircle } from "lucide-react";
import { useCourseById } from "@/hooks/useCourse";
import { useCourseProgress } from "@/contexts/CourseProgressContext";
import { useUser } from "@/hooks/useUser";
import { getCourseSlug, createSlug } from "@/lib/utils";
import { Lesson } from "@/services/course.service";

interface CourseDetailProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function CourseDetail({ params }: CourseDetailProps) {
  const { slug } = use(params);
  const router = useRouter();
  const { data: user, isLoading: isLoadingUser } = useUser();
  
  // Extract course ID from slug-id format (e.g., "fundamentals-of-tawheed-uuid-here")
  // UUIDs are typically 36 characters with hyphens, so we look for the last segment that matches UUID pattern
  const courseId = useMemo(() => {
    // UUID pattern: 8-4-4-4-12 hex characters with hyphens
    const uuidPattern = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;
    const match = slug.match(uuidPattern);
    return match ? match[1] : null;
  }, [slug]);
  
  const { data: course, isLoading: isLoadingCourse, error } = useCourseById(courseId || "");
  const courseProgress = useCourseProgress();
  const isLessonComplete = courseProgress.isLessonComplete;
  const getCourseProgress = courseProgress.getCourseProgress;

  useEffect(() => {
    if (!isLoadingUser && !user) {
      router.push("/login");
    }
  }, [user, isLoadingUser, router]);

  if (isLoadingUser || isLoadingCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading course...</p>
        </div>
      </div>
    );
  }
  
  if (!user) return null;

  if (!courseId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course ID is required</h1>
          <Button onClick={() => router.push("/course")}>Back to Courses</Button>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course not found</h1>
          <Button onClick={() => router.push("/course")}>Back to Courses</Button>
        </div>
      </div>
    );
  }

  // Handle lessons array from API - sort by orderIndex
  const lessons = useMemo(() => {
    const lessonsArray = (course.lessons as Lesson[]) || [];
    return [...lessonsArray].sort((a, b) => a.orderIndex - b.orderIndex);
  }, [course.lessons]);
  const lessonsCount = lessons.length;
  
  const progress = getCourseProgress(course.id, lessonsCount);
  const completedCount = lessons.filter((l) => {
    // Use lesson index (1-based) for progress tracking to maintain compatibility
    const lessonIndex = lessons.indexOf(l) + 1;
    return isLessonComplete(course.id, lessonIndex);
  }).length;

  const getNextLesson = () => {
    // Sort lessons by orderIndex to ensure correct order
    const sortedLessons = [...lessons].sort((a, b) => a.orderIndex - b.orderIndex);
    const incomplete = sortedLessons.find((l) => {
      const lessonIndex = sortedLessons.indexOf(l) + 1;
      return !isLessonComplete(course.id, lessonIndex);
    });
    return incomplete ? createSlug(incomplete.lessonTitle) : (sortedLessons[0] ? createSlug(sortedLessons[0].lessonTitle) : "");
  };

  // Get course slug for routing (course.id is stored in the course object)
  const courseSlug = getCourseSlug(course);

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/20 to-secondary/20 py-8">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4"
            onClick={() => router.push("/course")}
          >
            <ArrowLeft className="w-4 h-4 me-2" />
            Back to Courses
          </Button>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="aspect-video md:w-80 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-xl flex items-center justify-center overflow-hidden">
              {course.imageUrl ? (
                <img 
                  src={course.imageUrl} 
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-6xl font-bold text-primary/40">{lessonsCount}</span>
              )}
            </div>

            <div className="flex-1">
              {course.category && (
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                  {course.category.name}
                </span>
              )}
              <h1 className="text-2xl md:text-3xl font-bold mt-2 mb-2">{course.title}</h1>
              <p className="text-muted-foreground mb-4">{course.speaker.name}</p>
              <p className="text-sm text-muted-foreground mb-4">{course.description}</p>

              <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {lessonsCount} {lessonsCount === 1 ? "lesson" : "lessons"}
                </span>
              </div>

              {/* Progress Section */}
              {lessonsCount > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">
                      {completedCount} of {lessonsCount} lessons completed
                    </span>
                    <span className="font-medium text-primary">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {lessonsCount > 0 && (
                <Button onClick={() => router.push(`/course/${courseSlug}/lesson/${getNextLesson()}`)}>
                  <Play className="w-4 h-4 me-2" />
                  {progress > 0 ? "Continue Course" : "Start Course"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Lessons */}
      {lessons.length > 0 && (
        <section className="container mx-auto px-4 py-8">
          <h2 className="text-xl font-semibold mb-4">Course Content</h2>
          <div className="space-y-2">
            {lessons.map((lesson, index) => {
              // Use 1-based index for progress tracking compatibility
              const lessonIndex = index + 1;
              const lessonSlug = createSlug(lesson.lessonTitle);
              const completed = isLessonComplete(course.id, lessonIndex);

              return (
                <div
                  key={lesson.id}
                  onClick={() => router.push(`/course/${courseSlug}/lesson/${lessonSlug}`)}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      completed
                        ? "bg-primary text-primary-foreground"
                        : "bg-primary/10 text-foreground"
                    }`}
                  >
                    {completed ? <CheckCircle className="w-5 h-5" /> : index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{lesson.lessonTitle}</p>
                  </div>
                  {lesson.isPreview && (
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                      Preview
                    </span>
                  )}
                  <Play className="w-4 h-4 text-muted-foreground" />
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
