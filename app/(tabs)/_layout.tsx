import { Tabs, Redirect } from 'expo-router';
import React from 'react';
import { TabBarIcon, Header } from '@/components';
import {Appbar, Provider as PaperProvider, Text} from 'react-native-paper';
import { useAuth } from '@/services/AuthContext';
import { getTheme } from '@/utils/themeUtils';
import { useUsuario } from '@/hooks/useUsuario';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
    const { user, theme } = useAuth();
    const { usuario, carregando } = useUsuario();
    const systemTheme = useColorScheme();

    if (!user) {
        return <Redirect href="/login" />;
    }
    const userName = usuario?.nome || 'Usuário';
    const appliedTheme = getTheme(theme ?? 'auto', systemTheme ?? 'light');
    return (
        <PaperProvider theme={appliedTheme}>
            <Header title={`Bem vindo ${userName}`} showBackAction={false} />

            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: appliedTheme.colors.primary,
                    tabBarInactiveTintColor: appliedTheme.colors.onSurface,
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: appliedTheme.colors.surface,
                    },
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Home',
                        tabBarIcon: ({ color, focused }) => (
                            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="dashboard"
                    options={{
                        title: 'Dashboard',
                        tabBarIcon: ({ color, focused }) => (
                            <TabBarIcon name={focused ? 'analytics' : 'analytics-outline'} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: 'Profile',
                        tabBarIcon: ({ color, focused }) => (
                            <TabBarIcon name={focused ? 'people' : 'people-outline'} color={color} />
                        ),
                    }}
                />
            </Tabs>
        </PaperProvider>
    );
}
