import React, { useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { Provider as PaperProvider } from 'react-native-paper';
import { getTheme } from '@/utils/themeUtils';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider, useAuth } from '@/services/AuthContext';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';



export default function App() {
    const [loaded, setLoaded] = useState(false);

    // Carregando as fontes que você precisa
    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_700Bold,
    });

    useEffect(() => {

        async function prepare() {
            await SplashScreen.preventAutoHideAsync();
        }
        prepare();
    }, []);

    useEffect(() => {
        if (fontsLoaded) {
            setLoaded(true);
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!loaded) {
        return null;
    }

    return <AppRoot />;
}


function AppRoot() {
    return (
        <AuthProvider>

            <SignedIn>
                <RootLayout />
            </SignedIn>
        </AuthProvider>
    );
}

function SignedIn({ children }: { children: React.ReactNode }) {
    const { user, theme } = useAuth();
    const systemTheme = useColorScheme();

    if (!user) {
        return <SignedOut />;
    }


    const appliedTheme = getTheme(theme ?? 'auto', systemTheme ?? 'light');
    return (
        <PaperProvider theme={appliedTheme}>
            <ThemeProvider value={appliedTheme}>
                {children}
            </ThemeProvider>
        </PaperProvider>
    );
}

function SignedOut() {
    const systemTheme = useColorScheme() || 'light';
    const appliedTheme = getTheme('auto', systemTheme);

    return (
        <PaperProvider theme={appliedTheme}>
            <ThemeProvider value={systemTheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack screenOptions={{ headerShown: false }}>

                    <Stack.Screen name="login" options={{ title: 'Login' }} />
                    <Stack.Screen name="register" options={{ title: 'Register' }} />
                    <Stack.Screen name="forgotPassword" options={{ title: 'Forgot Password' }} />
                </Stack>
            </ThemeProvider>
        </PaperProvider>
    );
}

function RootLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ title: 'Home' }} />
            <Stack.Screen name="settings" options={{ title: 'Settings' }} />
            <Stack.Screen name="not-found" options={{ title: 'Not Found' }} />
        </Stack>
    );
}
