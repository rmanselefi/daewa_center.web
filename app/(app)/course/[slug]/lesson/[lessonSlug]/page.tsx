"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Play, Pause, CheckCircle, Clock } from "lucide-react";
import { useCourseById } from "@/hooks/useCourse";
import { useCourseProgress } from "@/contexts/CourseProgressContext";
import { useUser } from "@/hooks/useUser";
import { getCourseSlug, createSlug } from "@/lib/utils";
import { Lesson } from "@/services/course.service";
import { useAudioPlayerStore } from "@/stores/useAudioPlayerStore";
import { ContentItem } from "@/services/content.service";

interface LessonDetailProps {
  params: Promise<{
    slug: string;
    lessonSlug: string;
  }>;
}

export default function LessonDetail({ params }: LessonDetailProps) {
  const { slug, lessonSlug } = use(params);
  const router = useRouter();
  const { data: user, isLoading: isLoadingUser } = useUser();
  
  // Extract course ID from slug-id format (e.g., "fundamentals-of-tawheed-uuid-here")
  const courseId = useMemo(() => {
    const uuidPattern = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;
    const match = slug.match(uuidPattern);
    return match ? match[1] : null;
  }, [slug]);
  
  const { data: course, isLoading: isLoadingCourse, error } = useCourseById(courseId || "");
  const courseProgress = useCourseProgress();
  const { markLessonComplete, isLessonComplete, getCourseProgress } = courseProgress;
  const { currentTrack, isPlaying, setCurrentTrack, togglePlayPause } = useAudioPlayerStore();

  useEffect(() => {
    if (!isLoadingUser && !user) {
      router.push("/login");
    }
  }, [user, isLoadingUser, router]);

  // Sort lessons by orderIndex
  const lessons = useMemo(() => {
    if (!course?.lessons) return [];
    return [...(course.lessons as Lesson[])].sort((a, b) => a.orderIndex - b.orderIndex);
  }, [course?.lessons]);

  // Find current lesson by matching slug
  const currentLesson = useMemo(() => {
    return lessons.find((lesson) => {
      const lessonSlugFromTitle = createSlug(lesson.lessonTitle);
      return lessonSlugFromTitle === lessonSlug;
    });
  }, [lessons, lessonSlug]);

  // Get current lesson index
  const currentLessonIndex = useMemo(() => {
    if (!currentLesson) return -1;
    return lessons.findIndex((lesson) => lesson.id === currentLesson.id);
  }, [lessons, currentLesson]);

  // Get previous and next lessons
  const previousLesson = currentLessonIndex > 0 ? lessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < lessons.length - 1 ? lessons[currentLessonIndex + 1] : null;

  // Check if current lesson is completed
  const isCompleted = courseId && currentLesson ? isLessonComplete(courseId, currentLessonIndex + 1) : false;

  // Get course progress
  const courseSlug = course ? getCourseSlug(course) : "";
  const progress = courseId ? getCourseProgress(courseId, lessons.length) : 0;

  // Handle play/pause
  const handlePlayPause = () => {
    if (!currentLesson || !course) return;

    // Convert lesson to ContentItem format for audio player
    const audioTrack: ContentItem = {
      id: currentLesson.id,
      createdAt: currentLesson.createdAt,
      updatedAt: currentLesson.updatedAt,
      title: currentLesson.lessonTitle,
      description: null,
      audioUrl: currentLesson.contentUrl,
      duration: null,
      isPublished: true,
      isFeatured: false,
      playCount: 0,
      category: {
        id: course.category.id,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
        name: course.category.name,
        slug: course.category.name.toLowerCase().replace(/\s+/g, "-"),
        imageUrl: null,
        description: "",
      },
      speaker: {
        id: course.speaker.id,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
        name: course.speaker.name,
        bio: "",
        address: "",
        image: null,
      },
    };

    if (currentTrack?.id === currentLesson.id) {
      togglePlayPause();
    } else {
      setCurrentTrack(audioTrack);
      setTimeout(() => {
        useAudioPlayerStore.getState().play();
      }, 200);
    }
  };

  // Mark lesson as complete
  const handleComplete = () => {
    if (!courseId || !currentLesson) return;
    markLessonComplete(courseId, currentLessonIndex + 1);
  };

  // Check if it's the current playing track
  const isCurrentTrack = currentTrack?.id === currentLesson?.id;
  const showPause = isCurrentTrack && isPlaying;

  if (isLoadingUser || isLoadingCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading lesson...</p>
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

  if (error || !course || !currentLesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Lesson not found</h1>
          <Button onClick={() => router.push(`/course/${courseSlug}`)}>Back to Course</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/20 to-secondary/20 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/course/${courseSlug}`)}
            >
              <ArrowLeft className="w-4 h-4 me-2" />
              Back to Course
            </Button>
            {course.category && (
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                {course.category.name}
              </span>
            )}
          </div>

          <div className="mb-4">
            <h2 className="text-lg text-muted-foreground mb-2">{course.title}</h2>
            <h1 className="text-2xl md:text-3xl font-bold">{currentLesson.lessonTitle}</h1>
            <p className="text-muted-foreground mt-2">{course.speaker.name}</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground">
                Lesson {currentLessonIndex + 1} of {lessons.length}
              </span>
              <span className="font-medium text-primary">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button size="lg" className="gap-2" onClick={handlePlayPause} suppressHydrationWarning>
              {showPause ? (
                <>
                  <Pause className="w-5 h-5" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Play Lesson
                </>
              )}
            </Button>
            {!isCompleted && (
              <Button
                size="lg"
                variant="outline"
                className="gap-2"
                onClick={handleComplete}
              >
                <CheckCircle className="w-5 h-5" />
                Mark as Complete
              </Button>
            )}
            {isCompleted && (
              <Button size="lg" variant="outline" className="gap-2" disabled>
                <CheckCircle className="w-5 h-5" />
                Completed
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Lesson Content */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Audio Player Info */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Play className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{currentLesson.lessonTitle}</h3>
                <p className="text-sm text-muted-foreground">{course.speaker.name}</p>
              </div>
              {currentLesson.isPreview && (
                <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full">
                  Preview
                </span>
              )}
            </div>
          </div>

          {/* Lesson Info */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Order: {currentLesson.orderIndex}</span>
            </div>
            {currentLesson.contentUrl && (
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">Audio URL: </span>
                <a
                  href={currentLesson.contentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline break-all"
                >
                  {currentLesson.contentUrl}
                </a>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-8 border-t border-border">
            <div>
              {previousLesson ? (
                <Button
                  variant="outline"
                  onClick={() => router.push(`/course/${courseSlug}/lesson/${createSlug(previousLesson.lessonTitle)}`)}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous Lesson
                </Button>
              ) : (
                <div />
              )}
            </div>
            <div>
              {nextLesson ? (
                <Button
                  onClick={() => router.push(`/course/${courseSlug}/lesson/${createSlug(nextLesson.lessonTitle)}`)}
                  className="gap-2"
                >
                  Next Lesson
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => router.push(`/course/${courseSlug}`)}
                  className="gap-2"
                >
                  Back to Course
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
