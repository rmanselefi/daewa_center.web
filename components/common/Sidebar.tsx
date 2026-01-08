"use client";
import { Home, Compass, Search, User, BookOpen, GraduationCap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import { useUser } from "@/hooks/useUser";
import { LanguageSelector } from "@/components/common/LanguageSelector";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { useI18n } from "@/stores/useI18nStore";

// Reusable sidebar content component
export const SidebarContent = () => {
  const { data: user } = useUser();
  const { t } = useI18n();
  const pathname = usePathname();
  
  const navItems = [
    { icon: Home, label: t("home"), path: "/home" },
    { icon: Compass, label: t("browse"), path: "/browse" },
    { icon: Search, label: t("search"), path: "/search" },
    { icon: GraduationCap, label: t("courses"), path: "/course", protected: true },
    { icon: BookOpen, label: t("library"), path: "/library", protected: true },
    { icon: User, label: t("profile"), path: "/profile", protected: true },
  ].filter((item) => !item.protected || user);

  const isActive = (path: string) => pathname === path || pathname?.startsWith(`${path}/`);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Daewa Zone
        </h1>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
              isActive(item.path)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

// Desktop sidebar component
export const Sidebar = () => {
  return (
    <aside className="w-64 bg-card border-r border-border shrink-0 hidden md:block">
      <SidebarContent />
    </aside>
  );
};
