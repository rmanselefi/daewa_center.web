"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useI18n } from "@/stores/useI18nStore";

export default function LoginBanner() {
  const router = useRouter();
  const { data: user, isLoading } = useUser();
  const { t } = useI18n();
  console.log("banner", user);

  if (isLoading || user) return null;

  return (
    <Alert className="rounded-none border-x-0 border-t-0 bg-primary/10 border-primary/20 items-center">
      <LogIn className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>
          {t("browsingAsGuest")}{" "}
          <span className="font-semibold">{t("signIn")}</span> {t("signInToSave")}
        </span>
        <div className="flex gap-2 ml-4">
          <Button
            size="sm"
            variant="default"
            onClick={() => router.push("/login")}
          >
            {t("signIn")}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push("/register")}
          >
            {t("signUp")}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
