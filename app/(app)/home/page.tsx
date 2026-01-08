"use client";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { ContentCard } from "@/app/features/home/ContentCard";
import { useRouter } from "next/navigation";
import LoginBanner from "@/components/common/LoginBanner";
import { useFeaturedContent, useCategoryPreview, useTrendingContent } from "@/hooks/useContent";
import { createSlug, getContentSlug } from "@/lib/utils";
import { useI18n } from "@/stores/useI18nStore";

export default function Home() {
  const router = useRouter();
  const { t } = useI18n();
  const { data: featured = [], isLoading: isLoadingFeatured } = useFeaturedContent();
  const { data: categories = [], isLoading: isLoadingCategories } = useCategoryPreview();
  const { data: trending = [], isLoading: isLoadingTrending } = useTrendingContent(8);

  return (
    <div className="min-h-screen">
      {/* Guest Access Banner */}
      <LoginBanner />

      {/* Hero Section */}
      <section className="relative h-[400px] bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(45,212,191,0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-arabic">
            {t("welcome")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-2xl">
            {t("welcomeDescription")}
          </p>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90"
            onClick={() => router.push("/browse")}
          >
            {t("exploreContent")}
          </Button>
        </div>
      </section>

      {/* Featured Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{t("featuredThisWeek")}</h2>
          <Button variant="ghost" className="gap-2">
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
          <h2 className="text-2xl font-bold">{t("trending")}</h2>
          <Button variant="ghost" className="gap-2">
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
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            {t("noContent")}
          </div>
        )}
      </section>

      {/* Browse by Category */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">{t("browseByCategory")}</h2>
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
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="outline"
                className="h-auto py-6 flex flex-col items-center gap-2 hover:bg-primary/10 hover:border-primary"
                onClick={() => router.push(`/browse?category=${category.slug || category.name}`)}
              >
                <span className="font-semibold">{category.name}</span>
                {category.count && (
                  <span className="text-xs text-muted-foreground">
                    {typeof category.count === "number" 
                      ? `${category.count}+ lectures` 
                      : category.count}
                  </span>
                )}
              </Button>
            ))}
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
