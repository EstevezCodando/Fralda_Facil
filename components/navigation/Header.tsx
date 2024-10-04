import React, { useState } from 'react';
import { Appbar, Menu, Divider, useTheme, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { logoutUsuario } from '@/services/auth';
import { View, StyleSheet  } from 'react-native';

interface HeaderProps {
    title?: string;
    showBackAction?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title = '', showBackAction = false }) => {
    const router = useRouter();

    const { colors } = useTheme();

    const [menuVisible, setMenuVisible] = useState(false);

    const abrirMenu = () => setMenuVisible(true);
    const fecharMenu = () => setMenuVisible(false);

    const handleMenuItemPress = (item: string) => {
        fecharMenu();
        switch (item) {
            case 'Home':
                router.push('/');
                break;
            case 'Profile':
                router.push('/profile');
                break;
            case 'Settings':
                router.push('/settings');
                break;
            case 'Logout':
                logout();
                break;
            default:
                break;
        }
    };

    const logout = async () => {
        try {
            await logoutUsuario();
            router.replace('/login');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    return (
        <Appbar.Header style={styles.header}>
            {showBackAction && (
                <Appbar.BackAction onPress={() => router.push('/')} />
            )}
            <Appbar.Content title={<Text style={styles.title}>{title}</Text>} />
            <View style={styles.menu}>
                <Menu
                    visible={menuVisible}
                    onDismiss={fecharMenu}
                    anchorPosition="bottom"
                    anchor={
                        <Appbar.Action
                            icon="dots-vertical"
                            onPress={abrirMenu}
                        />
                    }
                >
                    <Menu.Item onPress={() => handleMenuItemPress('Home')} title="Home" />
                    <Menu.Item onPress={() => handleMenuItemPress('Profile')} title="Profile" />
                    <Menu.Item onPress={() => handleMenuItemPress('Settings')} title="Settings" />
                    <Divider />
                    <Menu.Item onPress={() => handleMenuItemPress('Logout')} title="Logout" />
                </Menu>
            </View>
        </Appbar.Header>
    );
};

const styles = StyleSheet.create({
    header: {
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        textAlign: 'center',
        flex: 1,
        fontFamily: 'Poppins_400Regular',
        fontSize: 18,
        color: '#333',
        paddingVertical: 20,
    },
    menu: {
        justifyContent: 'flex-end',
    }
});
export default Header;
