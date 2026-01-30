"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Settings,
  Bell,
  Download,
  HelpCircle,
  LogOut,
  Camera,
  User,
  Headphones,
  Clock,
  ListMusic,
  Sparkles,
} from "lucide-react";
import { useUser, useLogout, useUserStats, useUpdateProfile, useUploadProfileImage } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { UserResponse } from "@/services/auth.service";

const menuItems = [
  { icon: Settings, label: "Settings", path: "/settings" as string | null },
  { icon: Bell, label: "Notifications", path: "/notifications" as string | null },
  { icon: Download, label: "Downloads", path: null },
  { icon: HelpCircle, label: "Help & Support", path: null },
];

export default function Profile() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: user, isLoading } = useUser();
  const typedUser = user as UserResponse | null | undefined;
  const { mutate: logout } = useLogout();
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useUpdateProfile();
  const { mutate: uploadProfileImage, isPending: isUploadingImage } = useUploadProfileImage();
  const { data: stats, isLoading: isLoadingStats } = useUserStats(!!user);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFullname, setEditFullname] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const particleStyles = useMemo(
    () =>
      [...Array(15)].map((_, i) => {
        const n = (i * 7 + 1) % 100;
        const m = (i * 11 + 3) % 100;
        const size = 4 + (n % 9);
        const delay = 0.5 + (m % 30) / 10;
        const duration = 2 + (n % 30) / 10;
        return {
          width: `${size}px`,
          height: `${size}px`,
          left: `${(i * 17 + n) % 100}%`,
          top: `${(i * 13 + m) % 100}%`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
        };
      }),
    []
  );

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  const openEditModal = () => {
    if (typedUser) {
      setEditFullname(typedUser.fullname ?? "");
      setEditEmail(typedUser.email ?? "");
      setEditPhone(typedUser.phone ?? "");
    }
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = () => {
    updateProfile(
      {
        fullname: editFullname.trim() || null,
        email: editEmail.trim() || null,
        phone: editPhone.trim() || null,
      },
      {
        onSuccess: () => setIsEditModalOpen(false),
      }
    );
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      uploadProfileImage(file);
    }
    e.target.value = "";
  };

  const statsData = [
    {
      value: stats?.lecturesCompleted ?? 0,
      label: "Lectures Completed",
      icon: Headphones,
    },
    {
      value: stats?.totalTimeFormatted ?? "0m",
      label: "Total Time",
      icon: Clock,
    },
    {
      value: stats?.playlistsCount ?? 0,
      label: "Playlists",
      icon: ListMusic,
    },
  ];

  if (isLoading) return null;

  return (
    <div className="min-h-screen pb-24">
      {/* Animated Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />

        <div className="absolute inset-0 overflow-hidden">
          {particleStyles.map((style, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-primary/20 animate-pulse"
              style={style}
            />
          ))}
        </div>

        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-secondary/20 rounded-full blur-3xl" />

        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-primary rotate-45" />
          <div className="absolute bottom-10 right-10 w-24 h-24 border-2 border-secondary rotate-12" />
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="flex flex-col items-center text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <User className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Your Profile</span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              aria-hidden
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={handleAvatarClick}
              disabled={isUploadingImage}
              className="relative group rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 mb-4"
            >
              <Avatar className="w-24 h-24 ring-4 ring-primary/20 shadow-lg">
                {typedUser?.photoURL ? (
                  <AvatarImage src={typedUser.photoURL} alt="" />
                ) : null}
                <AvatarFallback className="text-3xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
                  {typedUser?.fullname
                    ? typedUser.fullname
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)
                    : typedUser?.email?.slice(0, 2).toUpperCase() ?? "?"}
                </AvatarFallback>
              </Avatar>
              <span
                className={`absolute inset-0 rounded-full bg-black/50 flex items-center justify-center transition-opacity ${
                  isUploadingImage ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
              >
                {isUploadingImage ? (
                  <span className="text-xs font-medium text-white">Uploading...</span>
                ) : (
                  <Camera className="w-8 h-8 text-white" />
                )}
              </span>
            </button>

            <h1 className="text-3xl font-bold mb-2">
              {typedUser?.fullname || typedUser?.email || "User"}
            </h1>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 border border-secondary/30 mb-6">
              <Sparkles className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium text-secondary-foreground">Premium Member</span>
            </div>

            <Button
              variant="outline"
              className="border-primary/30 hover:bg-primary/10 transition-all duration-300"
              onClick={openEditModal}
            >
              Edit Profile
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Listening Stats */}
        <Card
          className="p-6 mb-8 bg-card/50 backdrop-blur-sm border-border/50 animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Headphones className="w-5 h-5 text-primary" />
            Your Listening Stats
          </h3>
          {isLoadingStats ? (
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="text-center p-4 rounded-xl bg-muted/50 animate-pulse"
                  style={{ animationDelay: `${0.3 + i * 0.1}s` }}
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-muted" />
                  <div className="h-6 bg-muted rounded w-12 mx-auto mb-2" />
                  <div className="h-3 bg-muted rounded w-20 mx-auto" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {statsData.map((stat, index) => (
                <div
                  key={stat.label}
                  className="text-center p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-primary">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <Button
              key={item.label}
              variant="ghost"
              className="w-full justify-start gap-3 h-14 hover:bg-primary/10 transition-all duration-300 animate-fade-in group"
              style={{ animationDelay: `${0.5 + index * 0.1}s` }}
              onClick={() => item.path && router.push(item.path)}
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <span className="font-medium">{item.label}</span>
            </Button>
          ))}

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-14 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-300 animate-fade-in group"
            style={{ animationDelay: "0.9s" }}
            onClick={() => logout()}
          >
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="font-medium">Log Out</span>
          </Button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your display name, email, and phone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-fullname">Full name</Label>
              <Input
                id="edit-fullname"
                placeholder="Your name"
                value={editFullname}
                onChange={(e) => setEditFullname(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="you@example.com"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                type="tel"
                placeholder="+1234567890"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)} disabled={isUpdatingProfile}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile} disabled={isUpdatingProfile}>
              {isUpdatingProfile ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
