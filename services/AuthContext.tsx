import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '@/config/firebase';
import { useColorScheme } from 'react-native';

// Interface para o contexto de autenticação e tema
interface AuthContextProps {
    user: User | null;
    initializing: boolean;
    theme: string;
    changeTheme: (theme: string) => void;
}

// Criando o contexto
const AuthContext = createContext<AuthContextProps>({
    user: null,
    initializing: true,
    theme: 'auto',
    changeTheme: () => {},
});

// Hook para acessar o contexto
export const useAuth = () => useContext(AuthContext);

// Provedor de contexto que envolve o aplicativo
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [initializing, setInitializing] = useState(true);
    const [theme, setTheme] = useState('auto');

    const systemTheme = useColorScheme();

    // Função para alterar o tema, com memoização para evitar re-renderizações desnecessárias
    const changeTheme = useCallback((newTheme: string) => {
        if (newTheme !== theme) {
            setTheme(newTheme);
        }
    }, [theme]);

    // Listener do Firebase Auth para gerenciar o estado de autenticação
    useEffect(() => {
        const auth = getAuth(app);
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            if (initializing) setInitializing(false);
        });

        return () => unsubscribe();
    }, [initializing]);

    // Usa o tema do sistema se o tema estiver em 'auto'
    const themeValue = theme === 'auto' ? 'auto' : theme || 'auto'
    return (
        <AuthContext.Provider value={{ user, initializing, theme: themeValue, changeTheme }}>
            {children}
        </AuthContext.Provider>
    );
};
