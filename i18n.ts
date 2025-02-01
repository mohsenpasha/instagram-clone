import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./public/locales/en.json";
import fa from "./public/locales/fa.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fa: { translation: fa },
  },
  lng: "en", // زبان پیش‌فرض
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
