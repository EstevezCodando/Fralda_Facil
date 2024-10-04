// app/(tabs)/index.tsx

import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import Avatar from '../../components/avatar';
import { useUsuario } from '@/hooks/useUsuario';

import {Header} from "@/components";
import {useAuth} from "@/services/AuthContext";


const TelaHome = () => {
    const router = useRouter();
    const { colors } = useTheme();
    const { user, theme } = useAuth();
    const { usuario, carregando } = useUsuario();
    const userName = usuario?.nome || 'Usuário';

    return (

        <View style={[estilos.container, { backgroundColor: colors.background }]}>
            <Header title={`Bem vindo ${userName}`} showBackAction={false} />
            <ScrollView contentContainerStyle={estilos.scrollContainer}>

                <Card style={estilos.cardDescricao}>
                    <Card.Content>
                        <Title style={estilos.tituloDescricao}>Fralda Fácil</Title>
                        <Paragraph style={estilos.paragrafoDescricao}>
                            O aplicativo para ajudar mães a gerenciar o estoque de fraldas do seu bebê.
                        </Paragraph>
                    </Card.Content>
                </Card>


                <View style={estilos.linha}>
                    <TouchableOpacity
                        style={estilos.card}
                        onPress={() => router.push('/mercados')}
                    >
                        <Card style={estilos.cardInterno}>
                            <Card.Content style={estilos.cardContent}>
                                <Avatar
                                    source={require('../../assets/images/Mercado.png')}
                                    size={64}
                                    style={estilos.avatar}
                                />
                                <Title style={estilos.cardTitle}>Mercados</Title>
                            </Card.Content>
                        </Card>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={estilos.card}
                        onPress={() => router.push('/marcas')}
                    >
                        <Card style={estilos.cardInterno}>
                            <Card.Content style={estilos.cardContent}>
                                <Avatar
                                    source={require('../../assets/images/Marcas.png')}
                                    size={64}
                                    style={estilos.avatar}
                                />
                                <Title style={estilos.cardTitle}>Marcas</Title>
                            </Card.Content>
                        </Card>
                    </TouchableOpacity>
                </View>


                <View style={estilos.linha}>
                    <TouchableOpacity
                        style={estilos.card}
                        onPress={() => router.push('/gerir-fraldas')}
                    >
                        <Card style={estilos.cardInterno}>
                            <Card.Content style={estilos.cardContent}>
                                <Avatar
                                    source={require('../../assets/images/EstoqueDeFralda.png')}
                                    size={64}
                                    style={estilos.avatar}
                                />
                                <Title style={estilos.cardTitle}>Gerir Fraldas</Title>
                            </Card.Content>
                        </Card>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={estilos.card}
                        onPress={() => router.push('/fraldas-usadas')}
                    >
                        <Card style={estilos.cardInterno}>
                            <Card.Content style={estilos.cardContent}>
                                <Avatar
                                    source={require('../../assets/images/FraldaUsada.png')}
                                    size={64}
                                    style={estilos.avatar}
                                />
                                <Title style={estilos.cardTitle}>Fraldas Usadas</Title>
                            </Card.Content>
                        </Card>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )};

const estilos = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        padding: 20,
        alignItems: 'center',
    },
    cardDescricao: {
        width: '100%',
        marginBottom: 20,
    },
    tituloDescricao: {
        textAlign: 'center',
        fontSize: 24,
        marginBottom: 10,
    },
    paragrafoDescricao: {
        textAlign: 'center',
        fontSize: 16,
    },
    linha: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        width: '100%',
    },
    card: {
        width: '48%',
    },
    cardInterno: {
        flex: 1,
        justifyContent: 'center',
    },
    cardContent: {
        alignItems: 'center',
    },
    cardTitle: {
        marginTop: 10,
        fontSize: 16,
        color: '#000',
        textAlign: 'center',
    },
    avatar: {
        backgroundColor: 'transparent',
    },
});

export default TelaHome;
