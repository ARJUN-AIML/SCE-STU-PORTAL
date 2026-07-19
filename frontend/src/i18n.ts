import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import ta from "./locales/ta.json";
import te from "./locales/te.json";
import hi from "./locales/hi.json";
import ml from "./locales/ml.json";

const resources = {
  en: { translation: en },
  ta: { translation: ta },
  te: { translation: te },
  hi: { translation: hi },
  ml: { translation: ml },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
  });

export default i18n;
