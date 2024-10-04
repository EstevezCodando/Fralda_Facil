import React, { useState } from 'react';
import { Appbar, Menu, Divider, useTheme, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { logoutUsuario } from '../../services/auth';
import { useUsuario } from '../../hooks/useUsuario';
import { View } from 'react-native';

const Header = () => {
    const router = useRouter();
    const { usuario, carregando } = useUsuario();
    const { colors } = useTheme();
    const userName = usuario?.nome || 'Usuário';

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
        <Appbar.Header>
            <Appbar.Content title={<Text>{`Bem-vindo! ${userName}`}</Text>} />
            <View>
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

export default Header;
