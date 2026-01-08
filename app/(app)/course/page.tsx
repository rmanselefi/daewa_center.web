"use client";

import { Button } from "@/components/ui/button";
import { Clock, BookOpen } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useUser } from "@/hooks/useUser";
import { useCourses } from "@/hooks/useCourse";
import { useEffect } from "react";

export default function Courses() {
  const router = useRouter();
  const { data: user, isLoading } = useUser();
  const { data: courses = [], isLoading: isLoadingCourses, error } = useCourses();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) return null;
  
  if (!user) return null;

  // Filter only published courses
  const publishedCourses = courses.filter(course => course.isPublished);

  const categories = ["All", "Beginner", "Intermediate", "Advanced"];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/20 to-secondary/20 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Courses</h1>
          <p className="text-muted-foreground">Structured learning paths to deepen your Islamic knowledge</p>
        </div>
      </section>

      {/* Filters */}
      <section className="container mx-auto px-4 py-6">
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={cat === "All" ? "default" : "outline"}
              size="sm"
            >
              {cat}
            </Button>
          ))}
        </div>
      </section>

      {/* Course Grid */}
      <section className="container mx-auto px-4 pb-12">
        {isLoadingCourses ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading courses...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive">Failed to load courses. Please try again later.</p>
          </div>
        ) : publishedCourses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No courses available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {publishedCourses.map((course) => (
              <div
                key={course.id}
                className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                onClick={() => router.push(`/course/${course.id}`)}
              >
                <div className="aspect-video bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center relative overflow-hidden">
                  {course.imageUrl ? (
                    <img 
                      src={course.imageUrl} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-5xl font-bold text-primary/40">{course.lessons.length}</span>
                  )}
                  {course.category && (
                    <span className="absolute top-2 right-2 text-xs bg-background/80 px-2 py-1 rounded-full">
                      {course.category.name}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">{course.speaker.name}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      {course.lessons.length} lessons
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
