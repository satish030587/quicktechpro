"use client";

import { useRouter, useSearchParams } from "next/navigation";

const LANGUAGE_LABELS = {
  en: "English",
  es: "Spanish",
  hi: "Hindi",
  de: "German",
  pt: "Portuguese",
  fr: "French",
  ru: "Russian",
  it: "Italian",
  ja: "Japanese",
  zh: "Chinese",
};

const getLanguageLabel = (code) => {
  if (!code) return "Original";
  const normalised = code.toLowerCase();
  return LANGUAGE_LABELS[normalised] || normalised.toUpperCase();
};

export default function BlogLanguageSwitcher({ slug, availableLanguages = [], activeLanguage = "default" }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!Array.isArray(availableLanguages) || availableLanguages.length === 0) {
    return null;
  }

  const languageSet = Array.from(new Set(availableLanguages.filter(Boolean)));
  if (languageSet.length === 0) {
    return null;
  }

  const handleChange = (language) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!language) {
      params.delete("lang");
    } else {
      params.set("lang", language);
    }
    const query = params.toString();
    router.push(query ? `/blog/${slug}?${query}` : `/blog/${slug}`);
  };

  const current = activeLanguage === "default" ? "" : activeLanguage;

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-500">
      <span className="font-medium text-gray-600">View in:</span>
      <button
        type="button"
        onClick={() => handleChange("")}
        className={`rounded-full border px-3 py-1 transition-colors ${
          current === ""
            ? "border-blue-600 bg-blue-50 text-blue-600"
            : "border-gray-200 text-gray-600 hover:border-blue-500 hover:text-blue-600"
        }`}
      >
        Original
      </button>
      {languageSet.map((language) => (
        <button
          key={language}
          type="button"
          onClick={() => handleChange(language)}
          className={`rounded-full border px-3 py-1 transition-colors ${
            current === language
              ? "border-blue-600 bg-blue-50 text-blue-600"
              : "border-gray-200 text-gray-600 hover:border-blue-500 hover:text-blue-600"
          }`}
        >
          {getLanguageLabel(language)}
        </button>
      ))}
    </div>
  );
}
