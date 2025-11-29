"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Settings, Bell, Download, HelpCircle, LogOut } from "lucide-react";
import { useUser, useLogout } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Profile() {
  const router = useRouter();
  const { data: user, isLoading } = useUser();
  const { mutate: logout } = useLogout();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) return null;
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>

      {/* User Info */}
      <Card className="p-6 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="w-20 h-20">
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
              {user?.fullname
                ? user.fullname
                    .split(" ")
                    .map((n: any) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                : user?.email?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">
              {user?.fullname || user?.email || "User"}
            </h2>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <Button variant="outline">Edit Profile</Button>
      </Card>

      {/* Listening Stats */}
      <Card className="p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Your Listening Stats</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">127</p>
            <p className="text-sm text-muted-foreground">Lectures Completed</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">45h</p>
            <p className="text-sm text-muted-foreground">Total Time</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">23</p>
            <p className="text-sm text-muted-foreground">Playlists</p>
          </div>
        </div>
      </Card>

      {/* Settings */}
      <div className="space-y-2">
        <Button variant="ghost" className="w-full justify-start gap-3 h-12">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-3 h-12">
          <Bell className="w-5 h-5" />
          <span>Notifications</span>
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-3 h-12">
          <Download className="w-5 h-5" />
          <span>Downloads</span>
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-3 h-12">
          <HelpCircle className="w-5 h-5" />
          <span>Help & Support</span>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-12 text-destructive hover:text-destructive"
          onClick={() => logout()}
        >
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </Button>
      </div>
    </div>
  );
}
