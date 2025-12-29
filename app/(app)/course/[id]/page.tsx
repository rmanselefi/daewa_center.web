"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock, BookOpen, Play, CheckCircle } from "lucide-react";
import { getCourse } from "@/data/courses";
import { useCourseProgress } from "@/contexts/CourseProgressContext";
import { useUser } from "@/hooks/useUser";

interface CourseDetailProps {
  params: {
    id: string;
  };
}

export default function CourseDetail({ params }: CourseDetailProps) {
  const router = useRouter();
  const { data: user, isLoading } = useUser();
  const { isLessonComplete, getCourseProgress } = useCourseProgress();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) return null;
  
  if (!user) return null;

  const course = getCourse(Number(params.id));

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course not found</h1>
          <Button onClick={() => router.push("/course")}>Back to Courses</Button>
        </div>
      </div>
    );
  }

  const progress = getCourseProgress(course.id, course.lessons);
  const completedCount = course.lessonList.filter((l) =>
    isLessonComplete(course.id, l.id)
  ).length;

  const getNextLesson = () => {
    const incomplete = course.lessonList.find((l) => !isLessonComplete(course.id, l.id));
    return incomplete?.id || 1;
  };

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
            <div className="aspect-video md:w-80 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-xl flex items-center justify-center">
              <span className="text-6xl font-bold text-primary/40">{course.lessons}</span>
            </div>

            <div className="flex-1">
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                {course.level}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold mt-2 mb-2">{course.title}</h1>
              <p className="text-muted-foreground mb-4">{course.speaker}</p>
              <p className="text-sm text-muted-foreground mb-4">{course.description}</p>

              <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {course.lessons} lessons
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {course.duration}
                </span>
              </div>

              {/* Progress Section */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">
                    {completedCount} of {course.lessons} lessons completed
                  </span>
                  <span className="font-medium text-primary">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <Button onClick={() => router.push(`/course/${course.id}/lesson/${getNextLesson()}`)}>
                <Play className="w-4 h-4 me-2" />
                {progress > 0 ? "Continue Course" : "Start Course"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Lessons */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-4">Course Content</h2>
        <div className="space-y-2">
          {course.lessonList.map((lesson) => {
            const completed = isLessonComplete(course.id, lesson.id);

            return (
              <div
                key={lesson.id}
                onClick={() => router.push(`/course/${course.id}/lesson/${lesson.id}`)}
                className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    completed
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary/10 text-foreground"
                  }`}
                >
                  {completed ? <CheckCircle className="w-5 h-5" /> : lesson.id}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{lesson.title}</p>
                </div>
                <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                <Play className="w-4 h-4 text-muted-foreground" />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
