"use client";

import { useEffect } from "react";
import React from "react";
import i18next from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import your translations
import bgTranslation from "../public/locales/bg/common.json";
import enTranslation from "../public/locales/en/common.json";

const resources = {
  bg: {
    common: bgTranslation,
  },
  en: {
    common: enTranslation,
  },
};

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "bg",
    defaultNS: "common",
    detection: {
      // Disable URL path detection to prevent redirects
      order: ["localStorage", "cookie", "navigator", "htmlTag"],
      caches: ["localStorage", "cookie"],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default function I18nProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { i18n } = useTranslation();

  useEffect(() => {
    // This ensures that i18n is initialized on the client side
  }, [i18n]);

  return <React.Fragment>{children}</React.Fragment>;
}
