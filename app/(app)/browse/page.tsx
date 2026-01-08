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
import { Filter, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useInfiniteContent, useCategories, useSpeakers } from "@/hooks/useContent";
import { usePlaylists, useAddContentToPlaylist } from "@/hooks/usePlaylist";
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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [contentIdForPlaylist, setContentIdForPlaylist] = useState<string | undefined>();

  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();
  const { data: speakers = [], isLoading: isLoadingSpeakers } = useSpeakers();
  const { data: playlists = [], isLoading: isLoadingPlaylists } = usePlaylists();
  const { mutate: addContentToPlaylist } = useAddContentToPlaylist();

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

          <input
            type="text"
            placeholder={t("search") || "Search..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex h-10 w-full md:w-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />

          <Button variant="outline" className="gap-2 md:ml-auto">
            <Filter className="w-4 h-4" />
            {t("moreFilters")}
          </Button>
        </div>

        {/* Results count */}
        {!isLoading && totalItems > 0 && (
          <div className="mb-4 text-sm text-muted-foreground">
            {totalItems} {totalItems === 1 ? t("result") || "result" : t("results") || "results"}
          </div>
        )}

        {/* Content Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {content.map((item) => (
                <ContentCard
                  key={item.id}
                  title={item.title}
                  speaker={item.speaker.name}
                  duration={item.duration || "--:--"}
                  image={item.speaker.image || undefined}
                  onClick={() => router.push(`/content/${getContentSlug(item)}`)}
                  contentId={item.id}
                  onAddToPlaylist={(playlistId) => {
                    addContentToPlaylist({
                      playlistId,
                      contentId: item.id,
                    });
                  }}
                  onCreatePlaylist={(contentId) => {
                    // Set contentId first, then open modal to ensure it's available
                    if (contentId) {
                      setContentIdForPlaylist(contentId);
                    }
                    setIsCreateModalOpen(true);
                  }}
                  playlists={playlists}
                />
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
          </>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            {t("noContent")}
          </div>
        )}
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
