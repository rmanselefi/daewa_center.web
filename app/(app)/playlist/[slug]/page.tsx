"use client";

import { use, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, List } from "lucide-react";
import { ContentCard } from "@/app/features/home/ContentCard";
import { usePlaylist } from "@/hooks/usePlaylist";
import { parsePlaylistIdFromSlug } from "@/lib/utils";
import { getContentSlug } from "@/lib/utils";

interface PlaylistDetailProps {
  params: Promise<{ slug: string }>;
}

export default function PlaylistDetail({ params }: PlaylistDetailProps) {
  const { slug } = use(params);
  const router = useRouter();
  const playlistId = useMemo(() => parsePlaylistIdFromSlug(slug), [slug]);
  const { data: playlist, isLoading, error } = usePlaylist(playlistId || "");

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-10 w-48 bg-muted rounded animate-pulse mb-8" />
        <div className="h-8 bg-muted rounded animate-pulse w-2/3 mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={`skeleton-${i}`} className="aspect-square bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!playlistId || error || !playlist) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <p className="text-muted-foreground text-center py-12">Playlist not found.</p>
      </div>
    );
  }

  const items = playlist.items ?? [];

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => router.push("/library")}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Library
      </Button>

      <div className="mb-8">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <List className="h-5 w-5" />
          <span>Playlist</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">{playlist.name}</h1>
        {playlist.description && (
          <p className="text-muted-foreground mb-4">{playlist.description}</p>
        )}
        <p className="text-sm text-muted-foreground">
          {items.length} {items.length === 1 ? "lecture" : "lectures"}
        </p>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item: any) => (
            <ContentCard
              key={item.id}
              title={item.title ?? "Untitled"}
              speaker={item.speaker?.name ?? ""}
              duration={item.duration ?? "--:--"}
              image={item.speaker?.image}
              onClick={() => router.push(`/content/${getContentSlug(item)}`)}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-12">
          No lectures in this playlist yet.
        </p>
      )}
    </div>
  );
}
