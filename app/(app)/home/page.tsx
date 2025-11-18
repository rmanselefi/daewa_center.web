"use client";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { ContentCard } from "@/app/features/home/ContentCard";
import { useState } from "react";
import { useRouter } from "next/navigation";

export interface Playlist {
  id: string;
  title: string;
  count: number;
}

export default function Home() {
  const router = useRouter();
  const [playlists, setPlaylists] = useState<Playlist[]>([
    { id: "p1", title: "Morning Reminders", count: 12 },
    { id: "p2", title: "Tafsir Series", count: 30 },
    { id: "p3", title: "Character Development", count: 15 },
  ]);

  const featured = [
    {
      id: 1,
      title: "The Prophetic Way",
      speaker: "Sheikh Omar Suleiman",
      duration: "45:32",
    },
    {
      id: 2,
      title: "Understanding Tawheed",
      speaker: "Imam Yasir Qadhi",
      duration: "52:18",
    },
    {
      id: 3,
      title: "Stories of the Sahaba",
      speaker: "Mufti Menk",
      duration: "38:45",
    },
    {
      id: 4,
      title: "Tafsir Al-Fatiha",
      speaker: "Dr. Bilal Philips",
      duration: "1:02:15",
    },
  ];

  const trending = [
    {
      id: 5,
      title: "The Power of Dua",
      speaker: "Nouman Ali Khan",
      duration: "28:30",
    },
    {
      id: 6,
      title: "Patience in Hardship",
      speaker: "Sheikh Ahmad Al-Khalil",
      duration: "35:42",
    },
    {
      id: 7,
      title: "Signs of the Last Day",
      speaker: "Yasir Qadhi",
      duration: "48:15",
    },
    {
      id: 8,
      title: "The Night Journey",
      speaker: "Omar Suleiman",
      duration: "42:00",
    },
  ];

  const categories = [
    { name: "Qur'an Recitation", count: "500+ lectures" },
    { name: "Tafsir", count: "300+ lectures" },
    { name: "Hadith", count: "250+ lectures" },
    { name: "Fiqh", count: "200+ lectures" },
    { name: "Seerah", count: "180+ lectures" },
    { name: "Youth Talks", count: "150+ lectures" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(45,212,191,0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-arabic">
            Welcome to Daewa Zone
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-2xl">
            Your gateway to authentic Islamic knowledge. Stream lectures, Quran
            recitations, and spiritual guidance.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Explore Content
          </Button>
        </div>
      </section>

      {/* Featured Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured This Week</h2>
          <Button variant="ghost" className="gap-2">
            See All <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featured.map((item) => (
            <ContentCard
              key={item.id}
              title={item.title}
              speaker={item.speaker}
              duration={item.duration}
              onClick={() => router.push(`/content/${item.id}`)}
              onAddToPlaylist={(playlistId) =>
                setPlaylists([
                  ...playlists,
                  { id: playlistId, title: playlistId, count: 0 },
                ])
              }
              playlists={playlists}
            />
          ))}
        </div>
      </section>

      {/* Trending Now */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Trending Now</h2>
          <Button variant="ghost" className="gap-2">
            See All <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {trending.map((item) => (
            <ContentCard
              key={item.id}
              title={item.title}
              speaker={item.speaker}
              duration={item.duration}
              onClick={() => router.push(`/content/${item.id}`)}
              onAddToPlaylist={(playlistId) =>
                setPlaylists([
                  ...playlists,
                  { id: playlistId, title: playlistId, count: 0 },
                ])
              }
              playlists={playlists}
            />
          ))}
        </div>
      </section>

      {/* Browse by Category */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Button
              key={category.name}
              variant="outline"
              className="h-auto py-6 flex flex-col items-center gap-2 hover:bg-primary/10 hover:border-primary"
              onClick={() => router.push(`/browse?category=${category.name}`)}
            >
              <span className="font-semibold">{category.name}</span>
              <span className="text-xs text-muted-foreground">
                {category.count}
              </span>
            </Button>
          ))}
        </div>
      </section>
    </div>
  );
}
