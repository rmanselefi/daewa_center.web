import { Play, ListPlus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface ContentCardProps {
  title: string;
  speaker: string;
  duration: string;
  image?: string;
  contentId?: string; // ID of the content item
  onClick?: () => void;
  onAddToPlaylist?: (playlistId: string) => void;
  onCreatePlaylist?: (contentId?: string) => void;
  playlists?: Array<{ id: string; name: string; items: any[] }>;
}

export const ContentCard = ({
  title,
  speaker,
  duration,
  image,
  contentId,
  onClick,
  onAddToPlaylist,
  onCreatePlaylist,
  playlists,
}: ContentCardProps) => {
  // Show max 4 playlists
  const displayedPlaylists = playlists?.slice(0, 4) || [];
  const hasMorePlaylists = playlists && playlists.length > 4;
  return (
    <Card className="group relative overflow-hidden transition-all hover:bg-muted/50">
      <div
        className="aspect-square bg-muted relative cursor-pointer"
        onClick={onClick}
      >
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Play className="w-5 h-5 text-primary" />
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button
            size="icon"
            className="w-10 h-10 rounded-full bg-primary hover:bg-primary/90"
          >
            <Play className="w-5 h-5" />
          </Button>
        </div>
      </div>
      <div className="p-3">
        <div className="flex justify-between items-start gap-1.5">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold truncate mb-0.5">{title}</h3>
            <p className="text-xs text-muted-foreground truncate">{speaker}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{duration}</p>
          </div>
          {(onAddToPlaylist || onCreatePlaylist) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7 shrink-0 hover:bg-accent"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ListPlus className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-popover z-50">
                {displayedPlaylists.length > 0 && onAddToPlaylist && (
                  <>
                    {displayedPlaylists.map((playlist, index) => (
                      <DropdownMenuItem
                        key={`${playlist.id}-${index}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToPlaylist?.(playlist.id);
                        }}
                      >
                        {playlist.name}
                      </DropdownMenuItem>
                    ))}
                    {hasMorePlaylists && (
                      <div className="px-2 py-1.5 text-xs text-muted-foreground">
                        +{playlists.length - 4} more
                      </div>
                    )}
                  </>
                )}
                {displayedPlaylists.length === 0 && onAddToPlaylist && (
                  <div className="px-2 py-1.5 text-xs text-muted-foreground">
                    No playlists yet
                  </div>
                )}
                {onCreatePlaylist && (
                  <>
                    {displayedPlaylists.length > 0 && <DropdownMenuSeparator />}
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onCreatePlaylist?.(contentId);
                      }}
                      className="text-primary focus:text-primary"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Playlist
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </Card>
  );
};
