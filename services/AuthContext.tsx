import React, { createContext, useContext, useEffect, useState, useCallback  } from 'react';
import { User, getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '@/config/firebase';
import { useColorScheme } from 'react-native';

// Interface para o contexto de autenticação e tema
interface AuthContextProps {
    user: User | null;
    initializing: boolean;
    theme: string;  // Adicionando o tema ao contexto
    changeTheme: (theme: string) => void;  // Função para alterar o tema
}


const AuthContext = createContext<AuthContextProps>({
    user: null,
    initializing: true,
    theme: 'auto',  // Definindo 'auto' como padrão (Azul Bebê)
    changeTheme: () => {},  // Função vazia por padrão
});

// Hook para acessar o contexto
export const useAuth = () => useContext(AuthContext);

// Provedor de contexto que envolve o aplicativo
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [initializing, setInitializing] = useState(true);
    const [hydrated, setHydrated] = useState(false);
    const [theme, setTheme] = useState('auto');

    const systemTheme = useColorScheme();

    const changeTheme = useCallback((newTheme: string) => {
        if (newTheme !== theme) { // Evitar loops infinitos
            setTheme(newTheme);
        }
    }, [theme]);

    // Marca como hidratado após a montagem inicial
    useEffect(() => {
        setHydrated(true);
    }, []);

    // Listener do Firebase Auth para gerenciar o estado de autenticação
    useEffect(() => {
        if (!hydrated) return;

        const auth = getAuth(app);
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            if (initializing) setInitializing(false);
        });

        return () => unsubscribe();
    }, [hydrated, initializing]);

    // Definindo o tema com prioridade para o usuário, e caindo para 'auto' (Azul Bebê) se não for especificado
    const themeValue = theme === 'auto' ? 'auto' : theme || 'auto';  // Azul Bebê é o padrão auto
    return (
        <AuthContext.Provider value={{ user, initializing, theme: themeValue, changeTheme }}>
            {children}
        </AuthContext.Provider>
    );
};