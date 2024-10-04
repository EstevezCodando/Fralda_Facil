import { Tabs, Redirect } from 'expo-router';
import React from 'react';
import { TabBarIcon, Header } from '@/components';
import { Provider as PaperProvider } from 'react-native-paper';
import { useAuth } from '@/services/AuthContext';
import { getTheme } from '@/utils/themeUtils';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
    const { user, theme } = useAuth();
    const systemTheme = useColorScheme();

    if (!user) {
        return <Redirect href="/login" />;
    }

    const appliedTheme = getTheme(theme ?? 'auto', systemTheme ?? 'light');
    return (
        <PaperProvider theme={appliedTheme}>
            <Header />
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
