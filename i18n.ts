import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./public/locales/en.json";
import fa from "./public/locales/fa.json";
const default_lang :string = localStorage.getItem('lang') ?? 'en'
console.log(default_lang)
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fa: { translation: fa },
  },
  lng: default_lang, // زبان پیش‌فرض
  fallbackLng: default_lang,
  interpolation: { escapeValue: false },
});

export default i18n;
