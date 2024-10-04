import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import {Avatar, Button, TextInput} from '@/components';
import { validarEmail, validarSenha } from '@/utils/validators';
import { criarConta } from '@/services/auth';
import {Title} from "react-native-paper";

const TelaRegistro = () => {
    const router = useRouter();
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erroNome, setErroNome] = useState('');
    const [erroEmail, setErroEmail] = useState('');
    const [erroSenha, setErroSenha] = useState('');
    const [carregando, setCarregando] = useState(false);

    const handleRegistro = async () => {
        const emailValido = validarEmail(email);
        const senhaValida = validarSenha(senha);
        const nomeValido = nome.trim().length > 0;

        if (!nomeValido) {
            setErroNome('Por favor, insira seu nome.');
        } else {
            setErroNome('');
        }

        if (!emailValido) {
            setErroEmail('Por favor, insira um email válido.');
        } else {
            setErroEmail('');
        }

        if (!senhaValida) {
            setErroSenha('A senha deve ter pelo menos 6 caracteres.');
        } else {
            setErroSenha('');
        }

        if (nomeValido && emailValido && senhaValida) {
            setCarregando(true);
            try {
                await criarConta(email, senha, nome);
                router.push('/');
            } catch (error) {
                console.error(error);
            } finally {
                setCarregando(false);
            }
        }
    };

    return (

        <View style={styles.container}>

            <View style={styles.headerContainer}>
                <Avatar
                    source={require('../assets/images/crieconta.png')}
                    size={100}
                    style={styles.avatar}
                />
                <Title style={styles.title}>Crie sua conta !</Title>
            </View>

            <TextInput
                label="Nome"
                value={nome}
                onChangeText={setNome}
                error={!!erroNome}
                errorMessage={erroNome}
                style={styles.input}
            />
            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                error={!!erroEmail}
                errorMessage={erroEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
            />
            <TextInput
                label="Senha"
                value={senha}
                onChangeText={setSenha}
                error={!!erroSenha}
                errorMessage={erroSenha}
                secureTextEntry
                style={styles.input}
            />
            <Button onPress={handleRegistro} loading={carregando} style={styles.botao}>
                Criar Conta
            </Button>
            <Button onPress={() => router.back()} mode="text" style={styles.link}>
                Voltar
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    input: {
        marginBottom: 10,
    },
    botao: {
        marginTop: 10,
    },
    link: {
        marginTop: 5,
    },
    headerContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    avatar: {
        backgroundColor: 'transparent',
    },
    title: {
        marginTop: 10,
        fontSize: 24,
    },
});

export default TelaRegistro;
