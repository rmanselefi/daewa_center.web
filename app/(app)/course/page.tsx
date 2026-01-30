"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { BookOpen, GraduationCap, Sparkles } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useCourses } from "@/hooks/useCourse";
import { useI18n } from "@/stores/useI18nStore";
import { getCourseSlug } from "@/lib/utils";

const COURSES_PER_PAGE = 8;

export default function Courses() {
  const router = useRouter();
  const { t } = useI18n();
  const { data: user, isLoading } = useUser();
  const { data: courses = [], isLoading: isLoadingCourses, error } = useCourses();
  const [activeCategory, setActiveCategory] = useState("all");
  const [displayCount, setDisplayCount] = useState(COURSES_PER_PAGE);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  const publishedCourses = useMemo(
    () =>
      courses.filter(
        (course) => course.isPublished && course.lessons && course.lessons.length > 0
      ),
    [courses]
  );

  const categories = useMemo(() => {
    const base = [{ key: "all", label: t("coursesAll"), icon: Sparkles }];
    const seen = new Set<string>();
    publishedCourses
      .filter((c) => c.category?.name)
      .forEach((c) => {
        const name = c.category!.name;
        if (!seen.has(name)) {
          seen.add(name);
          base.push({ key: name, label: name, icon: BookOpen });
        }
      });
    return base;
  }, [publishedCourses, t]);

  const filteredCourses =
    activeCategory === "all"
      ? publishedCourses
      : publishedCourses.filter(
          (course) => course.category?.name === activeCategory
        );

  const coursesToShow = filteredCourses.slice(0, displayCount);
  const hasMore = displayCount < filteredCourses.length;

  // Reset display count when filter changes
  useEffect(() => {
    setDisplayCount(COURSES_PER_PAGE);
  }, [activeCategory]);

  if (isLoading) return null;
  if (!user) return null;

  return (
    <div className="min-h-screen">
      {/* Animated Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-accent/10 py-12 mb-8">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div
            className="absolute bottom-10 right-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-1/2 left-1/3 w-24 h-24 bg-primary/5 rounded-full blur-2xl animate-float"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute top-8 right-1/4 w-16 h-16 border border-primary/20 rotate-45 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          />
          <div
            className="absolute bottom-12 left-1/4 w-12 h-12 border border-accent/20 rotate-12 animate-fade-in"
            style={{ animationDelay: "0.5s" }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center animate-fade-in">
            <Badge
              variant="secondary"
              className="mb-4 bg-primary/20 text-primary border-primary/30"
            >
              <GraduationCap className="w-3 h-3 mr-1" />
              {t("coursesSubtitle")}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              {t("coursesTitle")}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("coursesSubtitle")}
            </p>
          </div>

          {/* Quick Filter Chips */}
          <div
            className="flex flex-wrap justify-center gap-3 mt-8 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setActiveCategory(cat.key)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300
                    ${
                      activeCategory === cat.key
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105"
                        : "bg-card/50 hover:bg-card border border-border/50 hover:border-primary/50 hover:scale-105"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div
        className="container mx-auto px-4 mb-6 animate-fade-in"
        style={{ animationDelay: "0.3s" }}
      >
        <p className="text-muted-foreground">
          Showing{" "}
          <span className="text-foreground font-semibold">
            {filteredCourses.length}
          </span>{" "}
          courses
        </p>
      </div>

      {/* Course Grid */}
      <section className="container mx-auto px-4 pb-12">
        {isLoadingCourses ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="rounded-xl border border-border bg-card overflow-hidden animate-pulse"
              >
                <div className="aspect-video bg-muted" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive">
              Failed to load courses. Please try again later.
            </p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No courses available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coursesToShow.map((course, index) => (
              <div
                key={course.id}
                role="button"
                tabIndex={0}
                onClick={() =>
                  router.push(`/course/${getCourseSlug(course)}-${course.id}`)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    router.push(
                      `/course/${getCourseSlug(course)}-${course.id}`
                    );
                  }
                }}
                className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 cursor-pointer hover:scale-[1.02] animate-fade-in"
                style={{ animationDelay: `${0.1 * Math.min(index, 8)}s` }}
              >
                <div className="aspect-video bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center relative overflow-hidden">
                  {course.imageUrl ? (
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-5xl font-bold text-primary/40 transition-transform duration-300 group-hover:scale-110">
                      {course.lessons.length}
                    </span>
                  )}
                  {course.category && (
                    <Badge
                      variant="secondary"
                      className="absolute top-2 end-2 bg-background/80 backdrop-blur-sm border-0"
                    >
                      {course.category.name}
                    </Badge>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 transition-transform duration-300 scale-75 group-hover:scale-100">
                      <BookOpen className="w-7 h-7 text-primary-foreground" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {course.speaker.name}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      {course.lessons.length} {t("courseLessons")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Section - only when there are more courses to show */}
        {!isLoadingCourses && filteredCourses.length > 0 && hasMore && (
          <div
            className="flex justify-center mt-12 animate-fade-in"
            style={{ animationDelay: "0.8s" }}
          >
            <button
              type="button"
              onClick={() =>
                setDisplayCount((prev) =>
                  Math.min(prev + COURSES_PER_PAGE, filteredCourses.length)
                )
              }
              className="group flex items-center gap-2 px-6 py-3 rounded-full border border-primary/50 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <span>{t("coursesLoadMore")}</span>
              <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
