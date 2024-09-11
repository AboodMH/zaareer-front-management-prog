import i18n from "i18next";
import i18nBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

let local_lang=localStorage.getItem("language");

i18n
  .use(i18nBackend)
  .use(initReactI18next)
  .init({
    fallbackLng: local_lang,
    lng: local_lang,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: "http://localhost:3000/i18n/{{lng}}.json",
    },
  });

export default i18n;
