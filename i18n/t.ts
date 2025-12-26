import { en, TranslationKey } from './locales/en';

// Simple nested object lookup
const getNestedValue = (obj: any, path: string): string => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj) || path;
};

export function t(key: TranslationKey): string {
    return getNestedValue(en, key);
}
