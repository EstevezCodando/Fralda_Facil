import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from 'react-native-paper';
import TextInput from '../components/textinput';
import Button from '../components/button';
import { validarEmail } from '../utils/validators';
import { resetSenha } from '../services/auth';

const TelaRecuperacaoSenha = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [erroEmail, setErroEmail] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [mensagem, setMensagem] = useState('');

    const handleResetSenha = async () => {
        const emailValido = validarEmail(email);

        if (!emailValido) {
            setErroEmail('Por favor, insira um email válido.');
        } else {
            setErroEmail('');
        }

        if (emailValido) {
            setCarregando(true);
            try {
                await resetSenha(email);
                setMensagem('Um email de recuperação foi enviado.');
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
                label="Email"
                value={email}
                onChangeText={setEmail}
                error={!!erroEmail}
                errorMessage={erroEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={estilos.input}
            />
            <Button
                onPress={handleResetSenha}
                loading={carregando}
                style={estilos.botao}
            >
                Recuperar Senha
            </Button>
            {mensagem ? <Text style={estilos.mensagem}>{mensagem}</Text> : null}
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
    mensagem: {
        marginTop: 10,
        textAlign: 'center',
    },
    link: {
        marginTop: 5,
    },
});

export default TelaRecuperacaoSenha;
