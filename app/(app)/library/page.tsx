"use client";
import { ContentCard } from "@/app/features/home/ContentCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { Plus, Sparkles, BookMarked, Clock, ListMusic } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { usePlaylists, useCreatePlaylist, useAddContentToPlaylist } from "@/hooks/usePlaylist";
import { useLibraryContent } from "@/hooks/useLibrary";
import { useRecentlyPlayed } from "@/hooks/usePlayHistory";
import { getContentSlug, getPlaylistSlug } from "@/lib/utils";
import { useI18n } from "@/stores/useI18nStore";

export default function Library() {
  const router = useRouter();
  const { t } = useI18n();
  const { data: user, isLoading } = useUser();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");

  const { data: playlists = [], isLoading: isLoadingPlaylists } = usePlaylists(!!user);
  const { mutate: createPlaylist, isPending: isCreatingPlaylist } = useCreatePlaylist();
  const { mutate: addContentToPlaylist } = useAddContentToPlaylist();

  const { data: savedContent = [], isLoading: isLoadingLibrary } = useLibraryContent(!!user);
  const { data: recentlyPlayed = [], isLoading: isLoadingRecentlyPlayed } = useRecentlyPlayed(5, !!user);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

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

  if (isLoading) return null;

  const handleCreatePlaylist = () => {
    if (!playlistName.trim()) return;
    createPlaylist(
      {
        name: playlistName,
        description: playlistDescription || undefined,
      },
      {
        onSuccess: () => {
          setPlaylistName("");
          setPlaylistDescription("");
          setIsDialogOpen(false);
        },
      }
    );
  };

  return (
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
          <div className="max-w-2xl animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">{t("libraryYourCollection")}</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold mb-4">{t("libraryTitle")}</h1>
            <p className="text-muted-foreground text-lg">{t("librarySubtitle")}</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-24">
        <Tabs defaultValue="saved" className="space-y-8">
          <TabsList className="w-full md:w-auto bg-muted/50 p-1 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <TabsTrigger value="saved" className="gap-2 data-[state=active]:bg-background">
              <BookMarked className="w-4 h-4" />
              {t("librarySaved")}
            </TabsTrigger>
            <TabsTrigger value="recent" className="gap-2 data-[state=active]:bg-background">
              <Clock className="w-4 h-4" />
              {t("libraryRecentlyPlayed")}
            </TabsTrigger>
            <TabsTrigger value="playlists" className="gap-2 data-[state=active]:bg-background">
              <ListMusic className="w-4 h-4" />
              {t("libraryPlaylistsTab")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="saved" className="space-y-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            {isLoadingLibrary ? (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            ) : savedContent.length > 0 ? (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {savedContent.map((item, index) => (
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
                      onAddToPlaylist={(playlistId) => {
                        addContentToPlaylist({ playlistId, contentId: item.id });
                      }}
                      onCreatePlaylist={() => setIsDialogOpen(true)}
                      playlists={playlists}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">{t("libraryNoSavedContent")}</div>
            )}
          </TabsContent>

          <TabsContent value="recent" className="space-y-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            {isLoadingRecentlyPlayed ? (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            ) : recentlyPlayed.length > 0 ? (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {recentlyPlayed.map((item, index) => (
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
                      onAddToPlaylist={(playlistId) => {
                        addContentToPlaylist({ playlistId, contentId: item.id });
                      }}
                      onCreatePlaylist={() => setIsDialogOpen(true)}
                      playlists={playlists}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">{t("libraryNoRecentlyPlayed")}</div>
            )}
          </TabsContent>

          <TabsContent value="playlists" className="space-y-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold">{t("libraryYourPlaylists")}</h2>
                <p className="text-muted-foreground text-sm">{t("libraryOrganizePlaylists")}</p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 hover:scale-105 transition-transform">
                    <Plus className="h-4 w-4" />
                    {t("libraryCreatePlaylist")}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("libraryCreatePlaylistTitle")}</DialogTitle>
                    <DialogDescription>{t("libraryCreatePlaylistDescription")}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Playlist Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g. Morning Reminders"
                        value={playlistName}
                        onChange={(e) => setPlaylistName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Input
                        id="description"
                        placeholder="A brief description of your playlist"
                        value={playlistDescription}
                        onChange={(e) => setPlaylistDescription(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isCreatingPlaylist}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreatePlaylist} disabled={isCreatingPlaylist || !playlistName.trim()}>
                      {isCreatingPlaylist ? "Creating..." : "Create"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {isLoadingPlaylists ? (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            ) : playlists.length > 0 ? (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {playlists.map((playlist, index) => (
                  <div
                    key={playlist.id}
                    role="link"
                    tabIndex={0}
                    onClick={() => router.push(`/playlist/${getPlaylistSlug(playlist)}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        router.push(`/playlist/${getPlaylistSlug(playlist)}`);
                      }
                    }}
                    className="group aspect-square bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-transparent hover:border-primary/30 rounded-xl p-6 flex flex-col justify-between cursor-pointer hover:bg-muted/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg animate-fade-in"
                    style={{ animationDelay: `${0.1 * index + 0.3}s` }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <ListMusic className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                        {playlist.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {playlist.items?.length ?? 0} {t("libraryLectures")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">{t("libraryNoPlaylists")}</div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
