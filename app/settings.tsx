import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import {RadioGroup, Radio, Button, Avatar } from '@/components';
import { useAuth } from '@/services/AuthContext';
import { useRouter } from 'expo-router';
import {Appbar, useTheme, IconButton, Title} from 'react-native-paper';

export default function SettingsScreen() {
    const { changeTheme, theme } = useAuth();
    const [valueChecked, setValueChecked] = useState(theme || 'auto');  // Define o valor inicial do tema
    const router = useRouter();
    const { colors } = useTheme();


    useEffect(() => {
        if (valueChecked !== theme) {  // Previne renderizações desnecessárias
            changeTheme(valueChecked);
        }
    }, [valueChecked, theme, changeTheme]);

    //  utilizando useCallback para evitar recriação desnecessária
    const handleLogout = useCallback(() => {
        router.replace('/login');
    }, [router]);

    return (
        <View style={styles.container}>
            {/* Barra superior com retorno e engrenagem */}
            <Appbar.Header style={{ backgroundColor: colors.primary }}>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title="Configurações" />
                <IconButton icon="cog" iconColor={colors.onSurface} size={24} disabled={true} />
            </Appbar.Header>
            <View style={styles.headerContainer}>
                <Avatar
                    source={require('../assets/images/Settings.png')}
                    size={300}
                    style={styles.avatar}
                />
                <Title style={styles.title}>Escolha seu Tema Favorito</Title>



                <RadioGroup>
                    <Radio
                        valueChecked={valueChecked}
                        setValueChecked={setValueChecked}
                        radios={[
                            { value: 'auto', label: 'Blue Baby ' },
                            { value: 'light', label: 'Light Baby' },
                            { value: 'dark', label: 'Dark Baby' },
                            { value: 'pink', label: 'Pink Baby' },
                        ]}
                    />
                </RadioGroup>


                <View style={styles.buttonContainer}>
                    <Button
                        mode="contained"
                        onPress={handleLogout}
                        style={{ backgroundColor: colors.primary }}
                    >
                        Logout
                    </Button>
                </View>
            </View>
            </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F8FF',
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    buttonContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    headerContainer: {
        alignItems: 'center',
        marginVertical: 70,
    },
    avatar: {
        backgroundColor: 'transparent',
    },
    title: {
        marginTop: 10,
        fontSize: 24,
    }
});
