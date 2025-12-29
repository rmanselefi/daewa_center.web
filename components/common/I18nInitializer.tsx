"use client";

import { useEffect } from "react";
import { useI18nStore } from "@/stores/useI18nStore";

export function I18nInitializer() {
  const locale = useI18nStore((state) => state.locale);

  useEffect(() => {
    // Set HTML attributes after client hydration
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  return null;
}

