import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper'; // Importando o tema aqui
import { useRouter } from 'expo-router';
import Avatar from '../components/avatar';
import TextInput from '../components/textinput';
import Button from '../components/button';
import { validarEmail, validarSenha } from '../utils/validators';
import { loginUsuario } from '../services/auth';
import { getTheme } from '../utils/themeUtils';  // Função que escolhe o tema
import { useAuth } from '../services/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Provider as PaperProvider } from 'react-native-paper';

const TelaLogin = () => {
    const router = useRouter();
    const { colors } = useTheme(); // Usando o tema do react-native-paper
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erroEmail, setErroEmail] = useState('');
    const [erroSenha, setErroSenha] = useState('');
    const [carregando, setCarregando] = useState(false);
    const { user, theme } = useAuth();  // Pega o tema atual
    const systemTheme = useColorScheme();  // Pega o tema do sistema

    // Sempre iniciar com Azul Bebê se o tema for 'auto'
    const appliedTheme = getTheme(theme ?? 'auto', systemTheme ?? 'light');

    const handleLogin = async () => {
        const emailValido = validarEmail(email);
        const senhaValida = validarSenha(senha);

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

        if (emailValido && senhaValida) {
            setCarregando(true);
            try {
                await loginUsuario(email, senha);
                router.push('/');
            } catch (error) {
                console.error(error);
            } finally {
                setCarregando(false);
            }
        }
    };

    return (
        <PaperProvider theme={appliedTheme}>
        <View style={[estilos.container, { backgroundColor: colors.background }]}>
            <Avatar
                source={require('../assets/images/logo.png')}
                style={estilos.logo}
                size={150}
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
            <Button onPress={handleLogin} loading={carregando} style={[estilos.botao, { backgroundColor: colors.primary }]}>
                Entrar
            </Button>
            <Button
                onPress={() => router.push('/register')}
                mode="text"
                style={estilos.link}
            >
                Criar Conta
            </Button>
            <Button
                onPress={() => router.push('/forgotPassword')}
                mode="text"
                style={estilos.link}
            >
                Esqueci Minha Senha
            </Button>
        </View>
        </PaperProvider>
    );
};

const estilos = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    logo: {
        alignSelf: 'center',
        marginBottom: 20,
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

export default TelaLogin;
