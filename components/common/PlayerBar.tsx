import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

export const PlayerBar = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(30);
  const [volume, setVolume] = useState(70);

  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-card border-t border-border z-30">
      <div className="container mx-auto px-4 py-3">
        {/* Progress Bar */}
        <div className="mb-2">
          <Slider
            value={[progress]}
            onValueChange={(value) => setProgress(value[0])}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>2:45</span>
            <span>8:23</span>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center justify-between">
          {/* Track Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 bg-muted rounded-md flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold truncate">
                The Importance of Patience
              </p>
              <p className="text-sm text-muted-foreground truncate">
                Sheikh Ahmad Al-Khalil
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 mx-4">
            <Button size="icon" variant="ghost">
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              className="bg-primary hover:bg-primary/90"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </Button>
            <Button size="icon" variant="ghost">
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          {/* Volume */}
          <div className="hidden md:flex items-center gap-2 flex-1 justify-end">
            <Volume2 className="w-4 h-4 text-muted-foreground" />
            <Slider
              value={[volume]}
              onValueChange={(value) => setVolume(value[0])}
              max={100}
              step={1}
              className="w-24"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
