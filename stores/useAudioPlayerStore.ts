import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ContentItem } from "@/services/content.service";

interface AudioPlayerState {
  // Current track
  currentTrack: ContentItem | null;
  audioElement: HTMLAudioElement | null;
  
  // Playback state
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  
  // Actions
  setCurrentTrack: (track: ContentItem | null) => void;
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  initializeAudio: () => void;
  cleanup: () => void;
}

export const useAudioPlayerStore = create<AudioPlayerState>()(
  persist(
    (set, get) => {
      const initializeAudio = () => {
        if (typeof window === "undefined") return;
        
        const { audioElement: existingAudio } = get();
        if (existingAudio) return; // Already initialized
        
        const audio = new Audio();
        
        // Enable CORS for cross-origin audio sources (e.g., Cloudflare R2, S3)
        audio.crossOrigin = "anonymous";
        
        // Event listeners
        audio.addEventListener("loadedmetadata", () => {
          set({ duration: audio.duration || 0 });
        });

        audio.addEventListener("timeupdate", () => {
          set({ currentTime: audio.currentTime || 0 });
        });

        audio.addEventListener("ended", () => {
          set({ isPlaying: false, currentTime: 0 });
        });

        audio.addEventListener("play", () => {
          set({ isPlaying: true });
        });

        audio.addEventListener("pause", () => {
          set({ isPlaying: false });
        });

        audio.addEventListener("error", (e) => {
          const audioEl = e.target as HTMLAudioElement;
          const error = audioEl.error;
          let errorMessage = "Unknown audio error";
          
          if (error) {
            switch (error.code) {
              case error.MEDIA_ERR_ABORTED:
                errorMessage = "Audio loading aborted";
                break;
              case error.MEDIA_ERR_NETWORK:
                errorMessage = "Network error while loading audio";
                break;
              case error.MEDIA_ERR_DECODE:
                errorMessage = "Audio decoding error";
                break;
              case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                errorMessage = `Audio source not supported: ${audioEl.src}`;
                break;
              default:
                errorMessage = `Audio error (code: ${error.code})`;
            }
          }
          
          console.error("Audio error:", errorMessage, {
            src: audioEl.src,
            networkState: audioEl.networkState,
            readyState: audioEl.readyState,
            error: error,
          });
          set({ isPlaying: false });
        });

        set({ audioElement: audio });
      };

      return {
        currentTrack: null,
        audioElement: null,
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        volume: 70,

        setCurrentTrack: (track) => {
          const { audioElement: audio } = get();
          
          if (!audio) {
            initializeAudio();
            const { audioElement: newAudio } = get();
            if (!newAudio) return;
            
            if (track) {
              // Validate audioUrl before setting
              if (!track.audioUrl || track.audioUrl.trim() === "") {
                console.error("Audio URL is missing or empty for track:", track.id);
                return;
              }
              
              // Ensure CORS is enabled for cross-origin audio (e.g., Cloudflare R2)
              newAudio.crossOrigin = "anonymous";
              newAudio.src = track.audioUrl;
              newAudio.volume = get().volume / 100;
              // Use "metadata" for streaming - only loads metadata, not entire file
              // Browser will use HTTP Range Requests to stream audio chunks as needed
              newAudio.preload = "metadata";
              newAudio.load();
              set({ currentTrack: track, currentTime: 0, duration: 0 });
            }
            return;
          }
          
          if (track) {
            // Validate audioUrl before setting
            if (!track.audioUrl || track.audioUrl.trim() === "") {
              console.error("Audio URL is missing or empty for track:", track.id);
              return;
            }
            
            // Pause current audio if playing
            if (get().isPlaying) {
              audio.pause();
            }
            
            // Ensure CORS is enabled for cross-origin audio (e.g., Cloudflare R2)
            audio.crossOrigin = "anonymous";
            // Set new source
            audio.src = track.audioUrl;
            audio.volume = get().volume / 100;
            // Use "metadata" for streaming - only loads metadata, not entire file
            // Browser will use HTTP Range Requests to stream audio chunks as needed
            audio.preload = "metadata";
            audio.load();
            
            set({ currentTrack: track, currentTime: 0, duration: 0 });
          } else {
            // Clear track
            audio.pause();
            audio.src = "";
            set({ currentTrack: null, isPlaying: false, currentTime: 0 });
          }
        },

        play: () => {
          const { audioElement } = get();
          if (audioElement && get().currentTrack) {
            // Wait for audio to be ready before playing
            if (audioElement.readyState >= 2) {
              // HAVE_CURRENT_DATA or higher - safe to play
              audioElement.play().catch((error) => {
                console.error("Error playing audio:", error);
              });
            } else {
              // Wait for audio to load
              const onCanPlay = () => {
                audioElement.removeEventListener("canplay", onCanPlay);
                audioElement.play().catch((error) => {
                  console.error("Error playing audio:", error);
                });
              };
              audioElement.addEventListener("canplay", onCanPlay);
              audioElement.load(); // Trigger load if not already loading
            }
          }
        },

        pause: () => {
          const { audioElement } = get();
          if (audioElement) {
            audioElement.pause();
          }
        },

        togglePlayPause: () => {
          const { isPlaying, play, pause } = get();
          if (isPlaying) {
            pause();
          } else {
            play();
          }
        },

        setCurrentTime: (time) => {
          set({ currentTime: time });
        },

        setDuration: (duration) => {
          set({ duration });
        },

        setVolume: (volume) => {
          const { audioElement } = get();
          if (audioElement) {
            audioElement.volume = volume / 100;
          }
          set({ volume });
        },

        seek: (time) => {
          const { audioElement } = get();
          if (audioElement) {
            audioElement.currentTime = time;
            set({ currentTime: time });
          }
        },

        initializeAudio,
        
        cleanup: () => {
          const { audioElement } = get();
          if (audioElement) {
            audioElement.pause();
            audioElement.src = "";
            // Remove event listeners
            audioElement.removeEventListener("loadedmetadata", () => {});
            audioElement.removeEventListener("timeupdate", () => {});
            audioElement.removeEventListener("ended", () => {});
            audioElement.removeEventListener("play", () => {});
            audioElement.removeEventListener("pause", () => {});
            audioElement.removeEventListener("error", () => {});
          }
          set({ audioElement: null, currentTrack: null, isPlaying: false });
        },
      };
    },
    {
      name: "audio-player-storage",
      partialize: (state) => ({
        volume: state.volume,
        // Don't persist currentTrack or playback state
      }),
    }
  )
);

// Audio will be initialized lazily when needed (in setCurrentTrack)

