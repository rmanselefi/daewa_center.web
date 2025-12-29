"use client";
import { ContentCard } from "@/app/features/home/ContentCard";
import { Button } from "@/components/ui/button";
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
import { useContent, useCategories, useSpeakers } from "@/hooks/useContent";
import { createSlug } from "@/lib/utils";
import { useI18n } from "@/stores/useI18nStore";

export interface Playlist {
  id: string;
  title: string;
  count: number;
}

import LoginBanner from "@/components/common/LoginBanner";

export default function Browse() {
  const router = useRouter();
  const { t } = useI18n();
  const [playlists, setPlaylists] = useState<Playlist[]>([
    { id: "p1", title: "Morning Reminders", count: 12 },
    { id: "p2", title: "Tafsir Series", count: 30 },
    { id: "p3", title: "Character Development", count: 15 },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>("all");

  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();
  const { data: speakers = [], isLoading: isLoadingSpeakers } = useSpeakers();

  const filters = {
    limit: 8,
    ...(selectedCategory !== "all" && { categoryId: selectedCategory }),
    ...(selectedSpeaker !== "all" && { speakerId: selectedSpeaker }),
  };

  const { data: content = [], isLoading: isLoadingContent } = useContent(filters);

  return (
    <>
      <LoginBanner />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t("browseContent")}</h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder={t("category")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allCategories")}</SelectItem>
              {isLoadingCategories ? (
                <SelectItem value="loading" disabled>{t("loading")}</SelectItem>
              ) : (
                categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          <Select value={selectedSpeaker} onValueChange={setSelectedSpeaker}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder={t("speaker")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allSpeakers")}</SelectItem>
              {isLoadingSpeakers ? (
                <SelectItem value="loading" disabled>{t("loading")}</SelectItem>
              ) : (
                speakers.map((speaker) => (
                  <SelectItem key={speaker.id} value={speaker.id}>
                    {speaker.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          <Button variant="outline" className="gap-2 md:ml-auto">
            <Filter className="w-4 h-4" />
            {t("moreFilters")}
          </Button>
        </div>

        {/* Content Grid */}
        {isLoadingContent ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-muted rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : content.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {content.map((item) => (
              <ContentCard
                key={item.id}
                title={item.title}
                speaker={item.speaker.name}
                duration={item.duration || "--:--"}
                image={item.speaker.image || undefined}
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
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            {t("noContent")}
          </div>
        )}
      </div>
    </>
  );
}
