"use client";
import { Home, Compass, Search, User, BookOpen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import { useUser } from "@/hooks/useUser";

export const Sidebar = () => {
  const { data: user } = useUser();
  const navItems = [
    { icon: Home, label: "Home", path: "/home" },
    { icon: Compass, label: "Browse", path: "/browse" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: BookOpen, label: "Library", path: "/library", protected: true },
    { icon: User, label: "Profile", path: "/profile", protected: true },
  ].filter((item) => !item.protected || user);

  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-64 bg-card border-r border-border shrink-0 hidden md:block">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-8">
          Daewa Zone
        </h1>
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
    </aside>
  );
};
