"use client";

import { use, useMemo, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, ArrowRight, CheckCircle, Play, Pause, List } from "lucide-react";
import { formatTime } from "@/lib/utils";
import { useI18n } from "@/stores/useI18nStore";
import { useCourseById, useLessonsWithProgress } from "@/hooks/useCourse";
import { useUser } from "@/hooks/useUser";
import { useUpdateLessonProgress } from "@/hooks/useLessonProgress";

interface CourseDetailProps {
  params: Promise<{ slug: string }>;
}

function parseCourseIdFromSlug(slug: string): string | null {
  const uuidPattern = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;
  const match = slug.match(uuidPattern);
  return match ? match[1] : null;
}

/** Format duration in seconds as "M:SS" (e.g. 5:00, 2:30) */
function formatDurationMinutes(seconds: number): string {
  if (!seconds || seconds <= 0) return "—";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function CourseDetail({ params }: CourseDetailProps) {
  const { slug } = use(params);
  const router = useRouter();
  const { t } = useI18n();
  const courseId = useMemo(() => parseCourseIdFromSlug(slug), [slug]);
  const { data: course, isLoading: isLoadingCourse, error } = useCourseById(courseId || "");
  const { data: lessons = [], isLoading: isLoadingLessons } = useLessonsWithProgress(courseId || "", !!courseId);
  const { data: user } = useUser();
  const { mutate: updateProgress } = useUpdateLessonProgress();
  const [showSidebar, setShowSidebar] = useState(true);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<number | null>(null);
  const [isPlayingLesson, setIsPlayingLesson] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [lessonDurations, setLessonDurations] = useState<Record<string, number>>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isSeekingRef = useRef<boolean>(false);
  const lastProgressUpdateRef = useRef<number>(0);

  // Sort lessons by orderIndex (should already be sorted, but just in case)
  const sortedLessons = useMemo(() => {
    return [...lessons].sort((a, b) => a.orderIndex - b.orderIndex);
  }, [lessons]);

  // Calculate overall course progress based on completed lessons
  const progress = useMemo(() => {
    if (sortedLessons.length === 0) return 0;
    const completedCount = sortedLessons.filter((lesson) => lesson.progress.isCompleted).length;
    return Math.round((completedCount / sortedLessons.length) * 100);
  }, [sortedLessons]);

  const getNextLessonIndex = (): number => {
    if (sortedLessons.length === 0) return 0;
    const idx = sortedLessons.findIndex((lesson) => !lesson.progress.isCompleted);
    return idx >= 0 ? idx : 0;
  };

  const handlePlayLesson = (index: number) => {
    if (!audioRef.current) {
      // Just select the lesson; audio will start when the player is ready
      setSelectedLessonIndex(index);
      return;
    }

    if (selectedLessonIndex === index) {
      // Toggle play/pause for the currently selected lesson
      if (isPlayingLesson) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
      }
    } else {
      // Switch to a new lesson and start playing it
      setSelectedLessonIndex(index);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch(() => {});
        }
      }, 0);
    }
  };

  const handleStartOrContinue = () => {
    if (sortedLessons.length === 0) return;
    const nextIdx = getNextLessonIndex();
    handlePlayLesson(nextIdx);
  };

  const handleComplete = () => {
    // Note: Marking complete should be handled by the API when audio ends
    // This is just for manual completion if needed
    // Auto-advance to next lesson if available
    if (selectedLessonIndex !== null) {
      const nextIdx = selectedLessonIndex + 1;
      if (nextIdx < sortedLessons.length) {
        handlePlayLesson(nextIdx);
      }
    }
  };

  // Reset progress tracking when lesson changes
  useEffect(() => {
    lastProgressUpdateRef.current = 0;
    setCurrentTime(0);
    setDuration(0);
  }, [selectedLessonIndex]);

  // Cache lesson duration when we get it from the audio (for display in lesson list)
  const selectedLesson =
    selectedLessonIndex !== null && sortedLessons[selectedLessonIndex]
      ? sortedLessons[selectedLessonIndex]
      : null;
  useEffect(() => {
    if (selectedLesson && duration > 0) {
      setLessonDurations((prev) => ({ ...prev, [selectedLesson.id]: duration }));
    }
  }, [selectedLesson, duration]);

  // Handle seeking when progress bar is dragged/clicked (updates position only; no API call)
  const handleSeek = (value: number[]) => {
    if (!audioRef.current || duration === 0) return;
    isSeekingRef.current = true;
    const newTime = (value[0] / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    lastProgressUpdateRef.current = newTime;
    setTimeout(() => {
      isSeekingRef.current = false;
    }, 100);
  };

  // Call progress API when user finishes dragging (on release/commit)
  const handleSeekCommit = (value: number[]) => {
    if (duration === 0) return;
    const newTime = (value[0] / 100) * duration;
    const lesson =
      selectedLessonIndex !== null && sortedLessons[selectedLessonIndex]
        ? sortedLessons[selectedLessonIndex]
        : null;
    if (user && lesson) {
      const completionPercentage = (newTime / duration) * 100;
      updateProgress({
        userId: user.id,
        data: {
          courseLessonId: lesson.id,
          listenedSeconds: Math.round(newTime),
          isCompleted: completionPercentage > 95,
        },
      });
    }
  };

  // Track audio progress and update API every 1 minute
  useEffect(() => {
    if (!selectedLesson || !user || !audioRef.current) return;

    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      const newCurrentTime = audio.currentTime;
      const audioDuration = audio.duration || 0;
      
      // Only update currentTime if not seeking (to prevent jitter during drag)
      if (!isSeekingRef.current) {
        setCurrentTime(newCurrentTime);
      }
      setDuration(audioDuration);
      
      // Update progress every 1 minute (60 seconds)
      const timeSinceLastUpdate = newCurrentTime - lastProgressUpdateRef.current;
      if (timeSinceLastUpdate >= 60 || lastProgressUpdateRef.current === 0) {
        const completionPercentage = audioDuration > 0 ? (newCurrentTime / audioDuration) * 100 : 0;
        const isCompleted = completionPercentage > 95;

        updateProgress({
          userId: user.id,
          data: {
            courseLessonId: selectedLesson.id,
            listenedSeconds: Math.round(newCurrentTime),
            isCompleted: isCompleted,
          },
        });

        lastProgressUpdateRef.current = newCurrentTime;
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [selectedLesson, user, updateProgress]);

  const isLoading = isLoadingCourse || isLoadingLessons;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">{t("loading")}</p>
      </div>
    );
  }

  if (!courseId || error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t("noContent")}</h1>
          <Button onClick={() => router.push("/course")}>{t("backToCourses")}</Button>
        </div>
      </div>
    );
  }

  const currentIndex = selectedLessonIndex ?? -1;
  const prevLesson = currentIndex > 0 ? sortedLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < sortedLessons.length - 1 ? sortedLessons[currentIndex + 1] : null;
  const isCurrentLessonComplete = selectedLesson?.progress.isCompleted ?? false;

  return (
    <div className="fixed inset-0 top-14 md:top-0 overflow-hidden flex flex-col lg:flex-row bg-background z-50">
      {/* Main Player Area */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-card shrink-0">
          <Button variant="ghost" size="sm" onClick={() => router.push("/course")}>
            <ArrowLeft className="w-4 h-4 me-2" />
            {t("backToCourses")}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>

        {/* Video Player Area */}
        {selectedLesson ? (
          <>
            <div className="flex-1 bg-black/90 flex items-center justify-center relative min-h-0 overflow-hidden">
              <div className="text-center text-white">
                <button
                  onClick={async () => {
                    // Wait for audio ref to be available
                    let attempts = 0;
                    const tryPlay = () => {
                      if (audioRef.current) {
                        if (isPlayingLesson) {
                          audioRef.current.pause();
                        } else {
                          audioRef.current.play().catch((err) => {
                            console.error("Failed to play:", err);
                          });
                        }
                      } else if (attempts < 10) {
                        attempts++;
                        setTimeout(tryPlay, 50);
                      }
                    };
                    tryPlay();
                  }}
                  className="w-20 h-20 rounded-full bg-primary/80 hover:bg-primary flex items-center justify-center transition-colors mb-4 mx-auto cursor-pointer"
                  suppressHydrationWarning
                >
                  {isPlayingLesson ? (
                    <Pause className="w-8 h-8" />
                  ) : (
                    <Play className="w-8 h-8 ms-1" />
                  )}
                </button>
                <p className="text-muted-foreground text-sm">
                  {isPlayingLesson ? t("pause") : t("playNow")}
                </p>
              </div>
              <audio
                ref={audioRef}
                src={selectedLesson.contentUrl}
                className="hidden"
                preload="auto"
                onLoadedData={() => {
                  // Audio is ready, can play now
                  if (audioRef.current) {
                    setDuration(audioRef.current.duration || 0);
                  }
                }}
                onPlay={() => setIsPlayingLesson(true)}
                onPause={() => setIsPlayingLesson(false)}
                onTimeUpdate={() => {
                  if (audioRef.current) {
                    setCurrentTime(audioRef.current.currentTime);
                    setDuration(audioRef.current.duration || duration);
                  }
                }}
                onEnded={() => {
                  setIsPlayingLesson(false);
                  // Mark lesson as complete when it ends
                  if (selectedLesson && user && audioRef.current) {
                    const finalDuration = audioRef.current.duration || duration;
                    updateProgress({
                      userId: user.id,
                      data: {
                        courseLessonId: selectedLesson.id,
                        listenedSeconds: Math.round(finalDuration),
                        isCompleted: true,
                      },
                    });
                  }
                  // Auto-advance to next lesson
                  if (selectedLessonIndex !== null) {
                    const nextIdx = selectedLessonIndex + 1;
                    if (nextIdx < sortedLessons.length) {
                      handlePlayLesson(nextIdx);
                    }
                  }
                }}
                onError={(e) => {
                  console.error("Audio error:", e);
                }}
              />
            </div>

            {/* Audio Player Controls */}
            <div className="p-4 bg-card border-t border-border shrink-0">
              <div className="max-w-3xl mx-auto">
                {/* Progress Bar */}
                <div>
                  <Slider
                    value={duration > 0 ? [(currentTime / duration) * 100] : [0]}
                    onValueChange={handleSeek}
                    onValueCommit={handleSeekCommit}
                    max={100}
                    step={0.1}
                    className="w-full cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lesson Info & Controls */}
            <div className="p-6 bg-card border-t border-border shrink-0">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <span>
                    {t("courseLessons")} {selectedLessonIndex !== null ? selectedLessonIndex + 1 : 0} / {sortedLessons.length}
                  </span>
                </div>
                <h1 className="text-xl md:text-2xl font-bold mb-4">{selectedLesson.lessonTitle}</h1>

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    variant="outline"
                    disabled={!prevLesson}
                    onClick={() => prevLesson && handlePlayLesson(currentIndex - 1)}
                  >
                    <ArrowLeft className="w-4 h-4 me-2" />
                    Previous
                  </Button>

                  {isCurrentLessonComplete ? (
                    <Button variant="secondary" disabled>
                      <CheckCircle className="w-4 h-4 me-2" />
                      {t("markComplete")}
                    </Button>
                  ) : (
                    <Button onClick={handleComplete}>
                      <CheckCircle className="w-4 h-4 me-2" />
                      {t("markComplete")}
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    disabled={!nextLesson}
                    onClick={() => nextLesson && handlePlayLesson(currentIndex + 1)}
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ms-2" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 bg-black/90 flex items-center justify-center min-h-0 overflow-hidden">
            <div className="text-center text-white">
              <p className="text-lg mb-4">{course.title}</p>
              <Button size="lg" onClick={handleStartOrContinue} className="gap-2">
                <Play className="w-5 h-5" />
                {progress > 0 ? t("continueCourse") : t("startCourse")}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar - Lesson List */}
      <div
        className={`lg:w-80 border-s border-border bg-card shrink-0 flex flex-col h-full min-h-0 ${
          showSidebar ? "flex" : "hidden lg:flex"
        }`}
      >
        <div className="p-4 border-b border-border shrink-0 bg-card z-10">
          <h2 className="font-semibold mb-2">{course.title}</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{progress}% {t("courseLessons")}</span>
          </div>
          <Progress value={progress} className="h-2 mt-2" />
        </div>

        <div className="divide-y divide-border overflow-y-auto flex-1 min-h-0">
          {sortedLessons.map((lesson, index) => {
            const isComplete = lesson.progress.isCompleted;
            const isCurrent = index === selectedLessonIndex;
            const isPlaying = isCurrent && isPlayingLesson;
            const hasProgress = lesson.progress.listenedSeconds > 0;

            return (
              <button
                key={lesson.id}
                onClick={() => handlePlayLesson(index)}
                className={`w-full flex items-center gap-3 p-4 text-start hover:bg-accent/50 transition-colors ${
                  isCurrent ? "bg-accent" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${
                    isComplete
                      ? "bg-primary text-primary-foreground"
                      : isCurrent
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isComplete ? <CheckCircle className="w-4 h-4" /> : index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isCurrent ? "text-primary" : ""}`}>
                    {lesson.lessonTitle}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatDurationMinutes(
                      Number(lesson.duration ?? lessonDurations[lesson.id] ?? 0)
                    )}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {lesson.isPreview && (
                      <p className="text-xs text-muted-foreground">{t("preview")}</p>
                    )}
                    {hasProgress && !isComplete && (
                      <p className="text-xs text-muted-foreground">
                        {Math.round(lesson.progress.listenedSeconds / 60)}m listened
                      </p>
                    )}
                  </div>
                </div>
                {isCurrent && (
                  <div className="shrink-0">
                    {isPlaying ? (
                      <Pause className="w-4 h-4 text-primary" />
                    ) : (
                      <Play className="w-4 h-4 text-primary" />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
