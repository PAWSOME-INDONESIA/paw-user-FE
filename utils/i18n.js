import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
// Set the key-value pairs for the different languages you want to support.
i18n.translations = {
  en: {
    editProfile: 'Edit Profile'
  },
  id: {
    editProfile: 'Ubah Profil',
  },
  ja: { welcome: 'こんにちは' },
};
// Set the locale once at the beginning of your app.
i18n.locale = Localization.locale;

export const translate = (lang, msg) => {
  return i18n.translations[lang || 'en'][msg]
}
