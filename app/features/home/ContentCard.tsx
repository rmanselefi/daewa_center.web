import { Play, ListPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ContentCardProps {
  title: string;
  speaker: string;
  duration: string;
  image?: string;
  onClick?: () => void;
  onAddToPlaylist?: (playlistId: string) => void;
  playlists?: Array<{ id: string; title: string; count: number }>;
}

export const ContentCard = ({
  title,
  speaker,
  duration,
  image,
  onClick,
  onAddToPlaylist,
  playlists,
}: ContentCardProps) => {
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
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <Play className="w-8 h-8 text-primary" />
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button
            size="icon"
            className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90"
          >
            <Play className="w-6 h-6" />
          </Button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground truncate">{speaker}</p>
            <p className="text-xs text-muted-foreground mt-1">{duration}</p>
          </div>
          {onAddToPlaylist && playlists && playlists.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-9 w-9 shrink-0 hover:bg-accent"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ListPlus className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-popover z-50">
                {playlists.map((playlist) => (
                  <DropdownMenuItem
                    key={playlist.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToPlaylist(playlist.id);
                    }}
                  >
                    {playlist.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </Card>
  );
};
