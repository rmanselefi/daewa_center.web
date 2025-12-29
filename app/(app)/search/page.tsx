"use client";
import { ContentCard } from "@/app/features/home/ContentCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Playlist } from "../browse/page";
import { useI18n } from "@/stores/useI18nStore";
import { useSearch, useRecentSearches, usePopularContent, useCategoryPreview } from "@/hooks/useContent";
import { createSlug } from "@/lib/utils";

import LoginBanner from "@/components/common/LoginBanner";

export default function Search() {
  const router = useRouter();
  const { t } = useI18n();
  const [playlists, setPlaylists] = useState<Playlist[]>([
    { id: "p1", title: "Morning Reminders", count: 12 },
    { id: "p2", title: "Tafsir Series", count: 30 },
    { id: "p3", title: "Character Development", count: 15 },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch data
  const { data: searchResults = [], isLoading: isLoadingSearch } = useSearch(debouncedQuery);
  const { data: recentSearches = [], isLoading: isLoadingRecent } = useRecentSearches(10);
  const { data: popularContent = [], isLoading: isLoadingPopular } = usePopularContent(20);
  const { data: categories = [], isLoading: isLoadingCategories } = useCategoryPreview();

  return (
    <>
      <LoginBanner />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t("search")}</h1>

        {/* Search Bar */}
        <div className="relative mb-8">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder={t("searchPlaceholder")}
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
            <h2 className="text-xl font-semibold mb-4">{t("recentSearches")}</h2>
            {isLoadingRecent ? (
              <div className="flex flex-wrap gap-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-9 w-24 bg-muted rounded-full animate-pulse"
                  />
                ))}
              </div>
            ) : recentSearches.length > 0 ? (
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
            ) : (
              <p className="text-muted-foreground">{t("noContent")}</p>
            )}
          </div>
        )}

        {/* Search Results / Popular Content */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {searchQuery ? t("searchResults") : t("popularContent")}
          </h2>
          {searchQuery ? (
            isLoadingSearch ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-muted rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {searchResults.map((item) => (
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
            )
          ) : (
            isLoadingPopular ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-muted rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : popularContent.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {popularContent.map((item) => (
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
            )
          )}
        </div>

        {/* Browse by Topic */}
        <div>
          <h2 className="text-xl font-semibold mb-4">{t("browseByTopic")}</h2>
          {isLoadingCategories ? (
            <div className="flex flex-wrap gap-2">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-9 w-24 bg-muted rounded-full animate-pulse"
                />
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant="secondary"
                  className="rounded-full"
                  onClick={() => router.push(`/browse?category=${category.slug || category.name}`)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">{t("noCategories")}</p>
          )}
        </div>
      </div>
    </>
  );
}
