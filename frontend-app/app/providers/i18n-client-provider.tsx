// app/providers/i18n-client-provider.tsx
"use client";

import { useState, useEffect, ReactNode } from "react";
import i18next from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import bgTranslation from "../../public/locales/bg/common.json";
import enTranslation from "../../public/locales/en/common.json";

// Initialize i18next outside the component
i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      bg: { common: bgTranslation },
      en: { common: enTranslation },
    },
    fallbackLng: "bg",
    defaultNS: "common",
    detection: {
      order: ["localStorage", "cookie", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default function I18nClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Return a placeholder with the same structure as your app
    return <div className="app-shell-placeholder">{children}</div>;
  }

  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
}
