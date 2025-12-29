"use client";

import { Button } from "@/components/ui/button";
import { Clock, BookOpen } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useUser } from "@/hooks/useUser";
import { useEffect } from "react";

export default function Courses() {
  const router = useRouter();
  const { data: user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) return null;
  
  if (!user) return null;

  const courses = [
    { id: 101, title: "Fundamentals of Tawheed", speaker: "Dr. Bilal Philips", lessons: 12, duration: "6 hours", level: "Beginner" },
    { id: 102, title: "Arabic for Beginners", speaker: "Sheikh Wisam Sharieff", lessons: 20, duration: "10 hours", level: "Beginner" },
    { id: 103, title: "Seerah of the Prophet", speaker: "Yasir Qadhi", lessons: 30, duration: "25 hours", level: "Intermediate" },
    { id: 104, title: "Understanding Fiqh", speaker: "Mufti Menk", lessons: 15, duration: "8 hours", level: "Intermediate" },
    { id: 105, title: "Tafsir of Surah Al-Kahf", speaker: "Nouman Ali Khan", lessons: 18, duration: "12 hours", level: "Advanced" },
    { id: 106, title: "Islamic History", speaker: "Dr. Yasir Qadhi", lessons: 25, duration: "20 hours", level: "Intermediate" },
    { id: 107, title: "Principles of Hadith", speaker: "Sheikh Ahmad Al-Khalil", lessons: 16, duration: "9 hours", level: "Advanced" },
    { id: 108, title: "Family in Islam", speaker: "Omar Suleiman", lessons: 10, duration: "5 hours", level: "Beginner" },
  ];

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all cursor-pointer"
              onClick={() => router.push(`/course/${course.id}`)}
            >
              <div className="aspect-video bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center relative">
                <span className="text-5xl font-bold text-primary/40">{course.lessons}</span>
                <span className="absolute top-2 right-2 text-xs bg-background/80 px-2 py-1 rounded-full">
                  {course.level}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{course.speaker}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    {course.lessons} lessons
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {course.duration}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
