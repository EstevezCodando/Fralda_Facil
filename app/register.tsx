import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, TextInput } from '@/components';
import { validarEmail, validarSenha } from '@/utils/validators';
import { criarConta } from '@/services/auth';

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
        <View style={estilos.container}>
            <TextInput
                label="Nome"
                value={nome}
                onChangeText={setNome}
                error={!!erroNome}
                errorMessage={erroNome}
                style={estilos.input}
            />
            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                error={!!erroEmail}
                errorMessage={erroEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={estilos.input}
            />
            <TextInput
                label="Senha"
                value={senha}
                onChangeText={setSenha}
                error={!!erroSenha}
                errorMessage={erroSenha}
                secureTextEntry
                style={estilos.input}
            />
            <Button onPress={handleRegistro} loading={carregando} style={estilos.botao}>
                Criar Conta
            </Button>
            <Button onPress={() => router.back()} mode="text" style={estilos.link}>
                Voltar
            </Button>
        </View>
    );
};

const estilos = StyleSheet.create({
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
});

export default TelaRegistro;
