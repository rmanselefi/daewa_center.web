"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles, BookOpen, Mic2, Users, Heart, Star, Headphones } from "lucide-react";
import { ContentCard } from "@/app/features/home/ContentCard";
import { useRouter } from "next/navigation";
import LoginBanner from "@/components/common/LoginBanner";
import { useFeaturedContent, useCategoryPreview, useTrendingContent } from "@/hooks/useContent";
import { getContentSlug } from "@/lib/utils";
import { useI18n } from "@/stores/useI18nStore";
import { useUser } from "@/hooks/useUser";
import { usePlaylists, useAddContentToPlaylist } from "@/hooks/usePlaylist";

export default function Home() {
  const router = useRouter();
  const { t } = useI18n();
  const { data: user } = useUser();
  const { data: featured = [], isLoading: isLoadingFeatured } = useFeaturedContent();
  const { data: categories = [], isLoading: isLoadingCategories } = useCategoryPreview();
  const { data: trending = [], isLoading: isLoadingTrending } = useTrendingContent(8);
  const isLoggedIn = !!user;
  const { data: playlists = [] } = usePlaylists(isLoggedIn);
  const { mutate: addContentToPlaylist } = useAddContentToPlaylist();

  const categoryIcons = [
    BookOpen,
    Sparkles,
    Star,
    BookOpen,
    Heart,
    Users,
  ];

  const categoryColors = [
    "from-primary/20 to-primary/5",
    "from-secondary/20 to-secondary/5",
    "from-accent/20 to-accent/5",
    "from-primary/20 to-primary/5",
    "from-secondary/20 to-secondary/5",
    "from-accent/20 to-accent/5",
  ];

  const stats = [
    { value: "10K+", label: "Lectures", icon: Headphones },
    { value: "500+", label: "Speakers", icon: Mic2 },
    { value: "1M+", label: "Listeners", icon: Users },
  ];

  // Generate particle positions only on client side to avoid hydration errors
  const [particles] = useState<Array<{
    width: number;
    height: number;
    left: number;
    top: number;
    animationDelay: number;
    animationDuration: number;
  }>>(() => {
    // Only generate particles on client side
    if (typeof window === "undefined") {
      return [];
    }
    return Array.from({ length: 20 }, () => ({
      width: Math.random() * 10 + 5,
      height: Math.random() * 10 + 5,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDelay: Math.random() * 3,
      animationDuration: Math.random() * 3 + 2,
    }));
  });

  return (
    <div className="min-h-screen">
      {/* Guest Access Banner */}
      <LoginBanner />

      {/* Hero Section - Enhanced with animations */}
      <section className="relative min-h-[500px] overflow-hidden flex items-center">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />

        {/* Floating particles - only render on client to prevent hydration mismatch */}
        {particles.length > 0 && (
          <div className="absolute inset-0 overflow-hidden" suppressHydrationWarning>
            {particles.map((particle, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-primary/20 animate-pulse"
                suppressHydrationWarning
                style={{
                  width: `${particle.width}px`,
                  height: `${particle.height}px`,
                  left: `${particle.left}%`,
                  top: `${particle.top}%`,
                  animationDelay: `${particle.animationDelay}s`,
                  animationDuration: `${particle.animationDuration}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Radial glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />

        {/* Decorative geometric patterns */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-40 h-40 border-2 border-primary rotate-45" />
          <div className="absolute bottom-20 right-20 w-32 h-32 border-2 border-secondary rotate-12" />
          <div className="absolute top-1/2 right-10 w-24 h-24 border-2 border-primary/50 -rotate-12" />
        </div>

        <div className="container mx-auto px-4 relative z-10 py-16">
          <div className="max-w-3xl animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Your Spiritual Journey Starts Here</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 font-arabic leading-tight">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Ilmora
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
              {t("welcomeDescription")}
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-105"
                onClick={() => router.push("/browse")}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                {t("exploreContent")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary/30 hover:bg-primary/10 transition-all duration-300"
                onClick={() => router.push("/course")}
              >
                <BookOpen className="w-5 h-5 mr-2" />
                {t("courses")}
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">{t("featuredThisWeek")}</h2>
            <p className="text-muted-foreground mt-1">Handpicked content for you this week</p>
          </div>
          <Button variant="ghost" className="gap-2 hover:bg-primary/10">
            {t("seeAll")} <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        {isLoadingFeatured ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-muted rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((item) => (
              <ContentCard
                key={item.id}
                title={item.title}
                speaker={item.speaker.name}
                duration={item.duration || "--:--"}
                image={item.speaker.image || undefined}
                onClick={() => router.push(`/content/${getContentSlug(item)}`)}
                contentId={item.id}
                onAddToPlaylist={isLoggedIn ? (playlistId) => {
                  addContentToPlaylist({
                    playlistId,
                    contentId: item.id,
                  });
                } : undefined}
                playlists={isLoggedIn ? playlists : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            {t("noFeaturedContent")}
          </div>
        )}
      </section>

      {/* Trending Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">{t("trending")}</h2>
            <p className="text-muted-foreground mt-1">What the community is listening to</p>
          </div>
          <Button variant="ghost" className="gap-2 hover:bg-primary/10">
            {t("seeAll")} <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        {isLoadingTrending ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-muted rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : trending.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {trending.map((item) => (
              <ContentCard
                key={item.id}
                title={item.title}
                speaker={item.speaker.name}
                duration={item.duration || "--:--"}
                image={item.speaker.image || undefined}
                onClick={() => router.push(`/content/${getContentSlug(item)}`)}
                contentId={item.id}
                onAddToPlaylist={isLoggedIn ? (playlistId) => {
                  addContentToPlaylist({
                    playlistId,
                    contentId: item.id,
                  });
                } : undefined}
                playlists={isLoggedIn ? playlists : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            {t("noContent")}
          </div>
        )}
      </section>

      {/* Browse by Category - Enhanced */}
      <section className="container mx-auto px-4 py-12 pb-24">
        <h2 className="text-2xl font-bold mb-2">{t("browseByCategory")}</h2>
        <p className="text-muted-foreground mb-8">Find content that speaks to your heart</p>
        {isLoadingCategories ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-24 bg-muted rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => {
              const Icon = categoryIcons[index % categoryIcons.length];
              const color = categoryColors[index % categoryColors.length];
              return (
                <Button
                  key={category.id}
                  variant="outline"
                  className={`h-auto py-8 flex flex-col items-center gap-3 border-2 hover:border-primary/50 hover:bg-gradient-to-br ${color} transition-all duration-300 hover:scale-105 hover:shadow-lg group animate-fade-in`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => router.push(`/browse?category=${category.slug || category.name}`)}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="font-semibold text-center">{category.name}</span>
                  {category.count && (
                    <span className="text-xs text-muted-foreground">
                      {typeof category.count === "number"
                        ? `${category.count}+ lectures`
                        : category.count}
                    </span>
                  )}
                </Button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            {t("noCategories")}
          </div>
        )}
      </section>
    </div>
  );
}
