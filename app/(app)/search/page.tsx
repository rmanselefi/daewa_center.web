"use client";
import { ContentCard } from "@/app/features/home/ContentCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, X, Sparkles } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/stores/useI18nStore";
import { useSearch, useRecentSearches, usePopularContent, useCategoryPreview } from "@/hooks/useContent";
import { usePlaylists, useAddContentToPlaylist } from "@/hooks/usePlaylist";
import { useUser } from "@/hooks/useUser";
import { getContentSlug } from "@/lib/utils";
import { CreatePlaylistModal } from "@/components/common/CreatePlaylistModal";
import LoginBanner from "@/components/common/LoginBanner";

export default function Search() {
  const router = useRouter();
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [contentIdForPlaylist, setContentIdForPlaylist] = useState<string | undefined>();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: searchResults = [], isLoading: isLoadingSearch } = useSearch(debouncedQuery);
  const { data: recentSearches = [], isLoading: isLoadingRecent } = useRecentSearches(10);
  const { data: popularContent = [], isLoading: isLoadingPopular } = usePopularContent(20);
  const { data: categories = [], isLoading: isLoadingCategories } = useCategoryPreview();
  const { data: user } = useUser();
  const isLoggedIn = !!user;
  const { data: playlists = [] } = usePlaylists(isLoggedIn);
  const { mutate: addContentToPlaylist } = useAddContentToPlaylist();

  const particleStyles = useMemo(
    () =>
      [...Array(15)].map((_, i) => {
        const n = (i * 7 + 1) % 100;
        const m = (i * 11 + 3) % 100;
        const size = 4 + (n % 9);
        const delay = 0.5 + (m % 30) / 10;
        const duration = 2 + (n % 30) / 10;
        return {
          width: `${size}px`,
          height: `${size}px`,
          left: `${(i * 17 + n) % 100}%`,
          top: `${(i * 13 + m) % 100}%`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
        };
      }),
    []
  );

  return (
    <>
      <LoginBanner />
      <div className="min-h-screen">
        {/* Animated Header */}
        <section className="relative overflow-hidden py-12 md:py-16">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />

          <div className="absolute inset-0 overflow-hidden">
            {particleStyles.map((style, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-primary/20 animate-pulse"
                style={style}
              />
            ))}
          </div>

          <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-secondary/20 rounded-full blur-3xl" />

          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-32 h-32 border-2 border-primary rotate-45" />
            <div className="absolute bottom-10 right-20 w-24 h-24 border-2 border-secondary rotate-12" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl mx-auto text-center animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">{t("searchDiscoverKnowledge")}</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold mb-4">{t("search")}</h1>
              <p className="text-muted-foreground mb-8">{t("searchSubtitle")}</p>

              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto">
                <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder={t("searchPlaceholder")}
                  className="pl-12 pr-12 h-14 text-lg rounded-full border-2 border-primary/20 bg-background/80 backdrop-blur-sm focus:border-primary/50 shadow-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 pb-24">
          {/* Recent Searches */}
          {!searchQuery && (
            <div className="mb-10 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <h2 className="text-xl font-semibold mb-4">{t("recentSearches")}</h2>
              {isLoadingRecent ? (
                <div className="flex flex-wrap gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-9 w-24 bg-muted rounded-full animate-pulse" />
                  ))}
                </div>
              ) : recentSearches.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <Button
                      key={search}
                      variant="outline"
                      className="rounded-full border-2 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 animate-fade-in"
                      style={{ animationDelay: `${0.1 * index + 0.2}s` }}
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

          {/* Popular Content / Search Results */}
          <div className="mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-xl font-semibold mb-2">
              {searchQuery ? t("searchResults") : t("popularContent")}
            </h2>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? `${t("searchResultsFor")} "${searchQuery}"`
                : t("searchPopularSubtitle")}
            </p>
            {searchQuery ? (
              isLoadingSearch ? (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="aspect-square bg-muted rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : searchResults.length > 0 ? (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {searchResults.map((item, index) => (
                    <div
                      key={item.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${0.1 * index + 0.3}s` }}
                    >
                      <ContentCard
                        title={item.title}
                        speaker={item.speaker.name}
                        duration={item.duration || "--:--"}
                        image={item.speaker.image || undefined}
                        onClick={() => router.push(`/content/${getContentSlug(item)}`)}
                        contentId={item.id}
                        onAddToPlaylist={
                          isLoggedIn
                            ? (playlistId) => addContentToPlaylist({ playlistId, contentId: item.id })
                            : undefined
                        }
                        onCreatePlaylist={
                          isLoggedIn
                            ? (contentId) => {
                                setContentIdForPlaylist(contentId);
                                setIsCreateModalOpen(true);
                              }
                            : undefined
                        }
                        playlists={isLoggedIn ? playlists : undefined}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">{t("noContent")}</div>
              )
            ) : isLoadingPopular ? (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="aspect-square bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            ) : popularContent.length > 0 ? (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {popularContent.map((item, index) => (
                  <div
                    key={item.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${0.1 * index + 0.3}s` }}
                  >
                    <ContentCard
                      title={item.title}
                      speaker={item.speaker.name}
                      duration={item.duration || "--:--"}
                      image={item.speaker.image || undefined}
                      onClick={() => router.push(`/content/${getContentSlug(item)}`)}
                      contentId={item.id}
                      onAddToPlaylist={
                        isLoggedIn
                          ? (playlistId) => addContentToPlaylist({ playlistId, contentId: item.id })
                          : undefined
                      }
                      onCreatePlaylist={
                        isLoggedIn
                          ? (contentId) => {
                              setContentIdForPlaylist(contentId);
                              setIsCreateModalOpen(true);
                            }
                          : undefined
                      }
                      playlists={isLoggedIn ? playlists : undefined}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">{t("noContent")}</div>
            )}
          </div>

          {/* Browse by Topic */}
          <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <h2 className="text-xl font-semibold mb-2">{t("browseByTopic")}</h2>
            <p className="text-muted-foreground mb-6">{t("searchBrowseByTopicSubtitle")}</p>
            {isLoadingCategories ? (
              <div className="flex flex-wrap gap-2">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-9 w-24 bg-muted rounded-full animate-pulse" />
                ))}
              </div>
            ) : categories.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {categories.map((category, index) => (
                  <Button
                    key={category.id}
                    variant="secondary"
                    className="rounded-full px-6 py-2 h-auto border-2 border-transparent hover:border-primary/30 hover:bg-primary/10 transition-all duration-300 hover:scale-105 animate-fade-in"
                    style={{ animationDelay: `${0.05 * index + 0.4}s` }}
                    onClick={() =>
                      router.push(`/browse?category=${category.slug || category.name}`)
                    }
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
      </div>

      <CreatePlaylistModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
    </>
  );
}
