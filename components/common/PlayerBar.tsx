"use client";

import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useAudioPlayerStore } from "@/stores/useAudioPlayerStore";
import { formatTime } from "@/lib/utils";
import { useEffect } from "react";

export const PlayerBar = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlayPause,
    seek,
    setVolume,
  } = useAudioPlayerStore();

  // Calculate progress percentage
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (value: number[]) => {
    const newTime = (value[0] / 100) * duration;
    seek(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  // Don't show player if no track
  if (!currentTrack) {
    return null;
  }

  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-card border-t border-border z-30">
      <div className="container mx-auto px-4 py-3">
        {/* Progress Bar */}
        <div className="mb-2">
          <Slider
            value={[progress]}
            onValueChange={handleSeek}
            max={100}
            step={0.1}
            className="w-full cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center justify-between gap-4">
          {/* Track Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 bg-muted rounded-md flex-shrink-0 overflow-hidden">
              {currentTrack.speaker.image ? (
                <img
                  src={currentTrack.speaker.image}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Play className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold truncate">{currentTrack.title}</p>
              <p className="text-sm text-muted-foreground truncate">
                {currentTrack.speaker.name}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 mx-4">
            <Button
              size="icon"
              className="bg-primary hover:bg-primary/90"
              onClick={togglePlayPause}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* Volume */}
          <div className="hidden md:flex items-center gap-2 flex-1 justify-end">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => setVolume(volume > 0 ? 0 : 70)}
            >
              {volume === 0 ? (
                <VolumeX className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Volume2 className="w-4 h-4 text-muted-foreground" />
              )}
            </Button>
            <Slider
              value={[volume]}
              onValueChange={handleVolumeChange}
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
