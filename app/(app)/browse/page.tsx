"use client";
import { ContentCard } from "@/app/features/home/ContentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export interface Playlist {
  id: string;
  title: string;
  count: number;
}

import LoginBanner from "@/components/common/LoginBanner";

export default function Browse() {
  const router = useRouter();
  const [playlists, setPlaylists] = useState<Playlist[]>([
    { id: "p1", title: "Morning Reminders", count: 12 },
    { id: "p2", title: "Tafsir Series", count: 30 },
    { id: "p3", title: "Character Development", count: 15 },
  ]);

  const content = [
    {
      id: 1,
      title: "The Prophetic Way",
      speaker: "Sheikh Omar Suleiman",
      duration: "45:32",
      category: "Seerah",
    },
    {
      id: 2,
      title: "Understanding Tawheed",
      speaker: "Imam Yasir Qadhi",
      duration: "52:18",
      category: "Aqeedah",
    },
    {
      id: 3,
      title: "Stories of the Sahaba",
      speaker: "Mufti Menk",
      duration: "38:45",
      category: "History",
    },
    {
      id: 4,
      title: "Tafsir Al-Fatiha",
      speaker: "Dr. Bilal Philips",
      duration: "1:02:15",
      category: "Tafsir",
    },
    {
      id: 5,
      title: "The Power of Dua",
      speaker: "Nouman Ali Khan",
      duration: "28:30",
      category: "Spirituality",
    },
    {
      id: 6,
      title: "Patience in Hardship",
      speaker: "Sheikh Ahmad Al-Khalil",
      duration: "35:42",
      category: "Character",
    },
    {
      id: 7,
      title: "Signs of the Last Day",
      speaker: "Yasir Qadhi",
      duration: "48:15",
      category: "Eschatology",
    },
    {
      id: 8,
      title: "The Night Journey",
      speaker: "Omar Suleiman",
      duration: "42:00",
      category: "Seerah",
    },
  ];

  return (
    <>
      {" "}
      <LoginBanner />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Browse Content</h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Select defaultValue="all">
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="quran">Quran Recitation</SelectItem>
              <SelectItem value="tafsir">Tafsir</SelectItem>
              <SelectItem value="hadith">Hadith</SelectItem>
              <SelectItem value="fiqh">Fiqh</SelectItem>
              <SelectItem value="seerah">Seerah</SelectItem>
              <SelectItem value="aqeedah">Aqeedah</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all-speakers">
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Speaker" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-speakers">All Speakers</SelectItem>
              <SelectItem value="omar">Sheikh Omar Suleiman</SelectItem>
              <SelectItem value="yasir">Yasir Qadhi</SelectItem>
              <SelectItem value="menk">Mufti Menk</SelectItem>
              <SelectItem value="nouman">Nouman Ali Khan</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all-lang">
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-lang">All Languages</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ar">Arabic</SelectItem>
              <SelectItem value="ur">Urdu</SelectItem>
              <SelectItem value="tr">Turkish</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="gap-2 md:ml-auto">
            <Filter className="w-4 h-4" />
            More Filters
          </Button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {content.map((item) => (
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
    </>
  );
}
