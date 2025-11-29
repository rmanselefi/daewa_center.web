"use client";
import { ContentCard } from "@/app/features/home/ContentCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Playlist } from "../browse/page";

import LoginBanner from "@/components/common/LoginBanner";

export default function Search() {
  const router = useRouter();
  const [playlists, setPlaylists] = useState<Playlist[]>([
    { id: "p1", title: "Morning Reminders", count: 12 },
    { id: "p2", title: "Tafsir Series", count: 30 },
    { id: "p3", title: "Character Development", count: 15 },
  ]);
  const [searchQuery, setSearchQuery] = useState("");

  const recentSearches = ["Tafsir", "Patience", "Prayer", "Ramadan"];

  const popularContent = [
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

  return (
    <>
      <LoginBanner />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Search</h1>

        {/* Search Bar */}
        <div className="relative mb-8">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder="Search lectures, speakers, topics..."
            className="pl-10 pr-10 h-12"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Recent Searches */}
        {!searchQuery && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Recent Searches</h2>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search) => (
                <Button
                  key={search}
                  variant="outline"
                  className="rounded-full"
                  onClick={() => setSearchQuery(search)}
                >
                  {search}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Popular Content */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {searchQuery ? "Search Results" : "Popular Content"}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {popularContent.map((item) => (
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
        </div>

        {/* Quick Filters */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Browse by Topic</h2>
          <div className="flex flex-wrap gap-2">
            {[
              "Tafsir",
              "Hadith",
              "Fiqh",
              "Seerah",
              "Spirituality",
              "Youth",
              "Ramadan",
              "Hajj",
            ].map((topic) => (
              <Button
                key={topic}
                variant="secondary"
                className="rounded-full"
                onClick={() => router.push(`/browse?topic=${topic}`)}
              >
                {topic}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
