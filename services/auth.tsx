// services/auth.tsx

import { app } from '@/config/firebase';
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    updateProfile,
} from 'firebase/auth';

import { criarUsuario } from './usuarios';

const auth = getAuth(app);

export const loginUsuario = async (email: string, senha: string) => {
    try {
        await signInWithEmailAndPassword(auth, email, senha);
    } catch (error) {
        throw error;
    }
};

export const criarConta = async (email: string, senha: string, nome: string) => {
    try {
        // Cria o usuário com email e senha
        const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;

        // Atualiza o perfil do usuário com o displayName
        await updateProfile(user, {
            displayName: nome,
        });

        // Opcional: Chama criarUsuario para salvar informações adicionais no banco de dados
        await criarUsuario(nome);
    } catch (error) {
        throw error;
    }
};

export const resetSenha = async (email: string) => {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error) {
        throw error;
    }
};

export const logoutUsuario = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        throw error;
    }
};
