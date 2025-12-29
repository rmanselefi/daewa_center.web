"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, Plus, Share2, Clock, Calendar } from "lucide-react";
import { ContentCard } from "@/app/features/home/ContentCard";
import { useI18n } from "@/stores/useI18nStore";
import { useContentById } from "@/hooks/useContent";
import { useAudioPlayerStore } from "@/stores/useAudioPlayerStore";

interface ContentDetailProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ContentDetail({ params }: ContentDetailProps) {
  const { slug } = use(params);
  const router = useRouter();
  const { t } = useI18n();
  // The slug in the URL is actually the content ID
  const { data: content, isLoading } = useContentById(slug);
  
  // Hardcoded related content for now
  const relatedContent = [
    {
      id: "1",
      title: "Sample Related Content 1",
      speaker: { name: "Speaker Name", image: null, bio: null },
      duration: "10:30",
    },
    {
      id: "2",
      title: "Sample Related Content 2",
      speaker: { name: "Speaker Name", image: null, bio: null },
      duration: "15:45",
    },
    {
      id: "3",
      title: "Sample Related Content 3",
      speaker: { name: "Speaker Name", image: null, bio: null },
      duration: "20:20",
    },
    {
      id: "4",
      title: "Sample Related Content 4",
      speaker: { name: "Speaker Name", image: null, bio: null },
      duration: "12:10",
    },
  ];
  
  const { currentTrack, isPlaying, setCurrentTrack, togglePlayPause } = useAudioPlayerStore();
  // Check if we're on the client to avoid hydration mismatch
  const mounted = typeof window !== "undefined";

  const handlePlay = () => {
    if (content) {
      // Check if audioUrl exists
      if (!content.audioUrl || content.audioUrl.trim() === "") {
        console.error("Content has no audio URL:", content.id);
        return;
      }
      
      if (currentTrack?.id === content.id) {
        // Same track, just toggle play/pause
        togglePlayPause();
      } else {
        // New track, set it and play
        setCurrentTrack(content);
        // Wait for audio to load before playing
        setTimeout(() => {
          useAudioPlayerStore.getState().play();
        }, 200);
      }
    }
  };

  // Only check if it's the current track after component mounts to avoid hydration mismatch
  const isCurrentTrack = mounted ? currentTrack?.id === content?.id : false;
  const showPause = mounted && isCurrentTrack && isPlaying;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="aspect-square bg-muted rounded-lg animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-muted rounded animate-pulse" />
            <div className="h-6 bg-muted rounded animate-pulse w-3/4" />
            <div className="h-4 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t("noContent")}</p>
        </div>
      </div>
    );
  }

  const formattedDate = content.createdAt
    ? new Date(content.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Cover Image */}
        <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
          {content.speaker.image ? (
            <img
              src={content.speaker.image}
              alt={content.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center">
              <Play className="w-16 h-16 text-primary" />
            </div>
          )}
        </div>

        {/* Content Info */}
        <div className="flex flex-col justify-center">
          {content.isFeatured && (
            <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm mb-4 w-fit">
              {t("featured")}
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{content.title}</h1>
          <p className="text-xl text-muted-foreground mb-2">{content.speaker.name}</p>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{content.duration || "--:--"}</span>
            </div>
            {formattedDate && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formattedDate}</span>
              </div>
            )}
          </div>

          {content.description && (
            <p className="text-muted-foreground mb-6">{content.description}</p>
          )}

          <div className="flex flex-wrap gap-3">
            <Button 
              size="lg" 
              className="gap-2" 
              onClick={handlePlay}
              suppressHydrationWarning
            >
              {showPause ? (
                <>
                  <Pause className="w-5 h-5" />
                  {t("pause")}
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  {t("playNow")}
                </>
              )}
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <Plus className="w-5 h-5" />
              {t("addToLibrary")}
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <Share2 className="w-5 h-5" />
              {t("share")}
            </Button>
          </div>
        </div>
      </div>

      {/* About the Speaker */}
      {content.speaker.bio && (
        <Card className="p-6 mb-12">
          <h2 className="text-2xl font-bold mb-4">{t("aboutTheSpeaker")}</h2>
          <div className="flex items-start gap-4">
            {content.speaker.image ? (
              <img
                src={content.speaker.image}
                alt={content.speaker.name}
                className="w-20 h-20 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-muted shrink-0" />
            )}
            <div>
              <h3 className="text-xl font-semibold mb-2">{content.speaker.name}</h3>
              <p className="text-muted-foreground">{content.speaker.bio}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Related Content */}
      {relatedContent.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">{t("relatedContent")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedContent.map((item) => (
              <ContentCard
                key={item.id}
                title={item.title}
                speaker={item.speaker.name}
                duration={item.duration || "--:--"}
                image={item.speaker.image || undefined}
                onClick={() => router.push(`/content/${item.id}`)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
