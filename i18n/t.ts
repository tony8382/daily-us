import { getLocales } from 'expo-localization';
import { en } from './locales/en';
import { zh } from './locales/zh';

const translations: Record<string, any> = { en, zh };
const primaryLocale = getLocales()[0];
const languageCode = primaryLocale?.languageCode || 'en';
const activeTranslations = translations[languageCode] || en;

/**
 * Translate a key (e.g., 'common.loading')
 */
export function t(key: string, variables?: Record<string, string>): string {
    let translation = key.split('.').reduce((acc, part) => acc && acc[part], activeTranslations) || key;

    if (variables) {
        Object.entries(variables).forEach(([name, value]) => {
            translation = translation.replace(`{{${name}}}`, value);
        });
    }

    return translation;
}

/**
 * Get device language tag (e.g., 'zh-TW', 'en-US')
 */
export const getLocale = () => primaryLocale?.languageTag || 'en-US';
