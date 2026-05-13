import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  vi: {
    common: require('../../public/locales/vi/common.json'),
  },
  en: {
    common: require('../../public/locales/en/common.json'),
  },
};

// Get stored language preference
const getStoredLang = (): string => {
  if (typeof window === 'undefined') return 'vi';
  try {
    return localStorage.getItem('rtshop-lang') || 'vi';
  } catch {
    return 'vi';
  }
};

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: getStoredLang(),
      fallbackLng: 'vi',
      defaultNS: 'common',
      ns: ['common'],
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
    });
}

export default i18n;
