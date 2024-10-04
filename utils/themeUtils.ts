import { temaAzulBebe, temaLight, temaDark, temaRosaBebe } from '../config/theme';

export function getTheme(theme: string | null, systemTheme: string) {
    switch (theme) {
        case 'auto':
            return temaAzulBebe;
        case 'light':
            return temaLight;
        case 'dark':
            return temaDark;
        case 'pink':
            return temaRosaBebe;
        default:
            return systemTheme === 'dark' ? temaDark : temaLight;
    }
}