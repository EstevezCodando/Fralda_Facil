import { DefaultTheme as PaperDefaultTheme, MD3DarkTheme as PaperDarkTheme } from 'react-native-paper';
import { DefaultTheme as NavigationDefaultTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';

// Tema Azul Bebê (auto)
export const temaAzulBebe = {
    ...PaperDefaultTheme,
    ...NavigationDefaultTheme,
    colors: {
        ...PaperDefaultTheme.colors,
        ...NavigationDefaultTheme.colors,
        primary: '#89CFF0',  // Azul bebê
        accent: '#5DADE2',   // Azul destaque
        background: '#F0F8FF',
        surface: '#FFFFFF',
        text: '#000000',
        error: '#D32F2F',
        // Propriedades que faltam para o Navigation Theme
        card: '#FFFFFF',  // Cor do cartão (pode ajustar conforme necessidade)
        border: '#E0E0E0',  // Cor da borda
        notification: '#FF4081',  // Cor de notificação
    },
    roundness: 8,
};

// Tema Rosa Bebê
export const temaRosaBebe = {
    ...PaperDefaultTheme,
    ...NavigationDefaultTheme,
    colors: {
        ...PaperDefaultTheme.colors,
        ...NavigationDefaultTheme.colors,
        primary: '#FFB6C1',  // Rosa bebê
        accent: '#FF69B4',
        background: '#FFF0F5',
        surface: '#FFFFFF',
        text: '#000000',
        error: '#D32F2F',
        // Propriedades faltantes
        card: '#FFFFFF',
        border: '#E0E0E0',
        notification: '#FF4081',
    },
    roundness: 8,
};

// Tema Light
export const temaLight = {
    ...PaperDefaultTheme,
    ...NavigationDefaultTheme,
    colors: {
        ...PaperDefaultTheme.colors,
        ...NavigationDefaultTheme.colors,
        primary: '#6200EE', // Padrão roxo claro
        accent: '#03DAC6', // Padrão verde claro
        background: '#FFFFFF',
        surface: '#F0F0F0',
        text: '#000000',
        error: '#B00020',
    },
    roundness: 8,
};

// Tema Dark
export const temaDark = {
    ...PaperDarkTheme,
    ...NavigationDarkTheme,
    colors: {
        ...PaperDefaultTheme.colors,
        ...NavigationDefaultTheme.colors,
        primary: '#BB86FC', // Padrão roxo escuro
        accent: '#03DAC6',
        background: '#121212',
        surface: '#121212',
        text: '#FFFFFF',
        error: '#CF6679',
    },
    roundness: 8,
};
