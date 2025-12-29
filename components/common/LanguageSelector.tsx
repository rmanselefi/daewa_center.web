"use client";

import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/stores/useI18nStore";
import { Locale } from "@/lib/i18n/translations";

const languages: { code: Locale; name: string; nativeName: string }[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "am", name: "Amharic", nativeName: "አማርኛ" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
];

export function LanguageSelector() {
  const { locale, setLocale } = useI18n();
  const currentLanguage = languages.find((lang) => lang.code === locale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-foreground"
        >
          <Globe className="h-5 w-5" />
          <span className="sr-only">Select language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLocale(lang.code)}
            className={locale === lang.code ? "bg-accent" : ""}
          >
            <div className="flex items-center justify-between w-full">
              <span>{lang.nativeName}</span>
              <span className="text-xs text-muted-foreground ml-2">
                {lang.name}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

