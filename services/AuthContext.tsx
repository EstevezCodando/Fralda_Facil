import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '@/config/firebase';
import { obterUsuario, editarUsuario, Usuario } from '@/services/usuarios'; // Funções para obter e editar o usuário no DB
import { useColorScheme } from 'react-native';

// Interface para o contexto de autenticação e tema
interface AuthContextProps {
    user: Usuario | null; // Usamos `Usuario` definido no banco de dados
    initializing: boolean;
    theme: string;
    changeTheme: (theme: string) => void;
    updateUser: (novoNome: string) => Promise<void>; // Função para atualizar o nome do usuário
}

// Criando o contexto
const AuthContext = createContext<AuthContextProps>({
    user: null,
    initializing: true,
    theme: 'auto',
    changeTheme: () => {},
    updateUser: async () => {},
});

// Hook para acessar o contexto
export const useAuth = () => useContext(AuthContext);

// Provedor de contexto que envolve o aplicativo
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<Usuario | null>(null); // Usuário carregado do banco de dados
    const [initializing, setInitializing] = useState(true);
    const [theme, setTheme] = useState('auto');
    const systemTheme = useColorScheme();

    // Carregar o usuário do banco de dados após a autenticação
    useEffect(() => {
        const auth = getAuth(app);
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Se o usuário está autenticado, busque seus dados no Realtime Database
                try {
                    const dadosUsuario = await obterUsuario();
                    setUser(dadosUsuario); // Atualiza o estado do usuário
                } catch (error) {
                    console.error('Erro ao obter usuário:', error);
                }
            } else {
                setUser(null); // Não há usuário autenticado
            }
            setInitializing(false); // Finaliza o processo de inicialização
        });

        return () => unsubscribe();
    }, []);

    // Função para atualizar o nome do usuário no banco de dados
    const updateUser = async (novoNome: string) => {
        if (user) {
            try {
                await editarUsuario(novoNome); // Atualiza o nome no Realtime Database
                setUser({ ...user, nome: novoNome }); // Atualiza o estado localmente
            } catch (error) {
                console.error('Erro ao atualizar o nome do usuário:', error);
            }
        }
    };

    const changeTheme = useCallback((newTheme: string) => {
        if (newTheme !== theme) {
            setTheme(newTheme);
        }
    }, [theme]);

    const themeValue = theme === 'auto' ? 'auto' : theme || 'auto'
    return (
        <AuthContext.Provider value={{ user, initializing, theme: themeValue, changeTheme, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
