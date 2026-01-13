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
import { Badge } from "@/components/ui/badge";
import { Filter, Loader2, Sparkles, BookOpen, Mic, Globe, SlidersHorizontal } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useInfiniteContent, useCategories, useSpeakers } from "@/hooks/useContent";
import { usePlaylists, useAddContentToPlaylist } from "@/hooks/usePlaylist";
import { useUser } from "@/hooks/useUser";
import { useI18n } from "@/stores/useI18nStore";
import { getContentSlug } from "@/lib/utils";
import LoginBanner from "@/components/common/LoginBanner";
import { CreatePlaylistModal } from "@/components/common/CreatePlaylistModal";

// Skeleton loader component
const ContentCardSkeleton = () => (
  <div className="rounded-lg border bg-card overflow-hidden animate-pulse">
    <div className="aspect-square bg-muted" />
    <div className="p-4 space-y-2">
      <div className="h-4 bg-muted rounded w-3/4" />
      <div className="h-3 bg-muted rounded w-1/2" />
      <div className="h-3 bg-muted rounded w-1/3" />
    </div>
  </div>
);

export default function Browse() {
  const router = useRouter();
  const { t } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeQuickFilter, setActiveQuickFilter] = useState<string>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [contentIdForPlaylist, setContentIdForPlaylist] = useState<string | undefined>();

  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();
  const { data: speakers = [], isLoading: isLoadingSpeakers } = useSpeakers();
  const { data: user } = useUser();
  
  // Only fetch playlists if user is logged in
  const isLoggedIn = !!user;
  const { data: playlists = [] } = usePlaylists(isLoggedIn);
  const { mutate: addContentToPlaylist } = useAddContentToPlaylist();

  const quickFilters = [
    { id: "all", label: t("allCategories") || "All", icon: Sparkles },
    { id: "quran", label: "Qur&apos;an", icon: BookOpen },
    { id: "lectures", label: t("courses") || "Lectures", icon: Mic },
    { id: "multilingual", label: "Multilingual", icon: Globe },
  ];

  const filters = {
    limit: 10,
    ...(selectedCategory !== "all" && { category: selectedCategory }),
    ...(selectedSpeaker !== "all" && { speaker: selectedSpeaker }),
    ...(searchQuery.trim() && { search: searchQuery.trim() }),
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteContent(filters);

  // Flatten all pages into a single array
  const content = data?.pages.flatMap((page) => page.data) ?? [];
  const totalItems = data?.pages[0]?.meta.total ?? 0;

  // Intersection Observer for infinite scrolling
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Reset to first page when filters change
  useEffect(() => {
    // This will be handled by React Query's query key invalidation
  }, [selectedCategory, selectedSpeaker, searchQuery]);

  return (
    <>
      <LoginBanner />
      <div className="min-h-screen">
        {/* Animated Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-accent/10 py-12 mb-8">
          {/* Floating decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-10 right-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
            <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-primary/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "2s" }} />

            {/* Geometric patterns */}
            <div className="absolute top-8 right-1/4 w-16 h-16 border border-primary/20 rotate-45 animate-fade-in" style={{ animationDelay: "0.3s" }} />
            <div className="absolute bottom-12 left-1/4 w-12 h-12 border border-accent/20 rotate-12 animate-fade-in" style={{ animationDelay: "0.5s" }} />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center animate-fade-in">
              <Badge variant="secondary" className="mb-4 bg-primary/20 text-primary border-primary/30">
                <Sparkles className="w-3 h-3 mr-1" />
                Discover Knowledge
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                {t("browseContent")}
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Explore our vast collection of Islamic lectures, Qur&apos;an recitations, and spiritual guidance
              </p>
            </div>

            {/* Quick Filter Chips */}
            <div className="flex flex-wrap justify-center gap-3 mt-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              {quickFilters.map((filter) => {
                const Icon = filter.icon;
                return (
                  <button
                    key={filter.id}
                    onClick={() => setActiveQuickFilter(filter.id)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300
                      ${activeQuickFilter === filter.id
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105"
                        : "bg-card/50 hover:bg-card border border-border/50 hover:border-primary/50 hover:scale-105"
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{filter.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 pb-8">
          {/* Advanced Filters */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-4 mb-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center gap-2 mb-4">
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">{t("moreFilters")}</span>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[200px] bg-background/50 border-border/50 hover:border-primary/50 transition-colors">
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
                <SelectTrigger className="w-full md:w-[200px] bg-background/50 border-border/50 hover:border-primary/50 transition-colors">
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

              <input
                type="text"
                placeholder={t("search") || "Search..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex h-10 w-full md:w-[200px] rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />

              <Button variant="outline" className="gap-2 md:ml-auto border-primary/50 hover:bg-primary/10 hover:border-primary transition-all">
                <Filter className="w-4 h-4" />
                {t("moreFilters")}
              </Button>
            </div>
          </div>

          {/* Results Count */}
          {!isLoading && totalItems > 0 && (
            <div className="flex items-center justify-between mb-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <p className="text-muted-foreground">
                Showing <span className="text-foreground font-semibold">{totalItems}</span> {totalItems === 1 ? t("result") : t("results")}
              </p>
              <Select defaultValue="newest">
                <SelectTrigger className="w-[140px] bg-card/50 border-border/50">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Content Grid with staggered animation */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <ContentCardSkeleton key={i} />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-12 text-destructive">
              {t("errorLoadingContent") || "Error loading content. Please try again."}
            </div>
          ) : content.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {content.map((item, index) => (
                  <div
                    key={item.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${0.1 * index}s` }}
                  >
                    <ContentCard
                      title={item.title}
                      speaker={item.speaker.name}
                      duration={item.duration || "--:--"}
                      image={item.speaker.image || undefined}
                      onClick={() => router.push(`/content/${getContentSlug(item)}`)}
                      contentId={item.id}
                      onAddToPlaylist={isLoggedIn ? (playlistId) => {
                        addContentToPlaylist({
                          playlistId,
                          contentId: item.id,
                        });
                      } : undefined}
                      onCreatePlaylist={isLoggedIn ? (contentId) => {
                        if (contentId) {
                          setContentIdForPlaylist(contentId);
                        }
                        setIsCreateModalOpen(true);
                      } : undefined}
                      playlists={isLoggedIn ? playlists : undefined}
                    />
                  </div>
                ))}
              </div>

              {/* Infinite scroll trigger */}
              <div ref={observerTarget} className="h-20 flex items-center justify-center">
                {isFetchingNextPage && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>{t("loadingMore") || "Loading more..."}</span>
                  </div>
                )}
              </div>

              {/* End of results message */}
              {!hasNextPage && content.length > 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  {t("noMoreContent") || "No more content to load"}
                </div>
              )}

              {/* Load More Section */}
              {hasNextPage && (
                <div className="flex justify-center mt-12 animate-fade-in" style={{ animationDelay: "0.8s" }}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="group border-primary/50 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                  >
                    <span>{t("loadingMore") || "Load More Content"}</span>
                    <Sparkles className="w-4 h-4 ml-2 group-hover:animate-pulse" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              {t("noContent")}
            </div>
          )}
        </div>
      </div>

      <CreatePlaylistModal
        open={isCreateModalOpen}
        onOpenChange={(open) => {
          setIsCreateModalOpen(open);
          if (!open) setContentIdForPlaylist(undefined);
        }}
        contentId={contentIdForPlaylist}
      />
    </>
  );
}
