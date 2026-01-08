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
import { useState } from "react";
import { Plus } from "lucide-react";
import { createSlug } from "@/lib/utils";

import { useUser } from "@/hooks/useUser";
import { usePlaylists, useCreatePlaylist, useAddContentToPlaylist } from "@/hooks/usePlaylist";
import { CreatePlaylistModal } from "@/components/common/CreatePlaylistModal";
import { useEffect } from "react";

export default function Library() {
  const router = useRouter();
  const { data: user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) return null;
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");

  const { data: playlists = [], isLoading: isLoadingPlaylists } = usePlaylists();
  const { mutate: createPlaylist, isPending: isCreatingPlaylist } = useCreatePlaylist();
  const { mutate: addContentToPlaylist } = useAddContentToPlaylist();

  const savedContent = [
    {
      id: "1",
      title: "The Prophetic Way",
      speaker: "Sheikh Omar Suleiman",
      duration: "45:32",
    },
    {
      id: "2",
      title: "Understanding Tawheed",
      speaker: "Imam Yasir Qadhi",
      duration: "52:18",
    },
    {
      id: "3",
      title: "Stories of the Sahaba",
      speaker: "Mufti Menk",
      duration: "38:45",
    },
  ];

  const recentlyPlayed = [
    {
      id: "5",
      title: "The Power of Dua",
      speaker: "Nouman Ali Khan",
      duration: "28:30",
    },
    {
      id: "6",
      title: "Patience in Hardship",
      speaker: "Sheikh Ahmad Al-Khalil",
      duration: "35:42",
    },
  ];

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Library</h1>

      <Tabs defaultValue="saved" className="space-y-8">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="saved">Saved</TabsTrigger>
          <TabsTrigger value="recent">Recently Played</TabsTrigger>
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
        </TabsList>

        <TabsContent value="saved" className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {savedContent.map((item) => (
              <ContentCard
                key={item.id}
                title={item.title}
                speaker={item.speaker}
                duration={item.duration}
                onClick={() => router.push(`/content/${createSlug(item.title)}`)}
                contentId={item.id}
                onAddToPlaylist={(playlistId) => {
                  addContentToPlaylist({
                    playlistId,
                    contentId: item.id,
                  });
                }}
                onCreatePlaylist={(contentId) => setIsDialogOpen(true)}
                playlists={playlists}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {recentlyPlayed.map((item) => (
              <ContentCard
                key={item.id}
                title={item.title}
                speaker={item.speaker}
                duration={item.duration}
                onClick={() => router.push(`/content/${createSlug(item.title)}`)}
                contentId={item.id}
                onAddToPlaylist={(playlistId) => {
                  addContentToPlaylist({
                    playlistId,
                    contentId: item.id,
                  });
                }}
                onCreatePlaylist={(contentId) => setIsDialogOpen(true)}
                playlists={playlists}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="playlists" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Playlists</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Playlist
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Playlist</DialogTitle>
                  <DialogDescription>
                    Give your playlist a name and optional description.
                  </DialogDescription>
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
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isCreatingPlaylist}
                  >
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-muted rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : playlists.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="aspect-square bg-card rounded-lg p-6 flex flex-col justify-between cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      {playlist.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {playlist.items?.length || 0} {(playlist.items?.length || 0) === 1 ? "lecture" : "lectures"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No playlists yet. Create your first playlist!
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
