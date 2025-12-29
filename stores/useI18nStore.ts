import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Locale, translations, TranslationKey } from "@/lib/i18n/translations";

interface I18nState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set, get) => ({
      locale: "en",
      setLocale: (newLocale: Locale) => {
        set({ locale: newLocale });
        // Update HTML lang and dir attributes (only on client)
        if (typeof window !== "undefined") {
          document.documentElement.lang = newLocale;
          document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr";
        }
      },
      t: (key: TranslationKey): string => {
        const { locale } = get();
        return translations[locale][key] || translations.en[key] || key;
      },
    }),
    {
      name: "i18n-storage",
      partialize: (state) => ({ locale: state.locale }),
      onRehydrateStorage: () => (state) => {
        if (state && typeof window !== "undefined") {
          // Set HTML attributes on rehydration (after client mount)
          setTimeout(() => {
            document.documentElement.lang = state.locale;
            document.documentElement.dir = state.locale === "ar" ? "rtl" : "ltr";
          }, 0);
        }
      },
    }
  )
);

// Hook wrapper for easier migration (same API as before)
export function useI18n() {
  const locale = useI18nStore((state) => state.locale);
  const setLocale = useI18nStore((state) => state.setLocale);
  const t = useI18nStore((state) => state.t);

  return { locale, setLocale, t };
}

