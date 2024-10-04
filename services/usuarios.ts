import { app } from '../config/firebase';
import { getDatabase, ref, set, get } from 'firebase/database';import { getAuth } from 'firebase/auth';
const database = getDatabase(app);
const auth = getAuth(app);

export interface Usuario {
    usuarioId: string;
    email: string;
    nome: string;
    data_criacao: string;
}

export const criarUsuario = async (nome: string) => {
    try {
        const usuarioAtual = auth.currentUser;
        if (usuarioAtual) {
            const usuarioRef = ref(database, `usuarios/${usuarioAtual.uid}`);
            const usuario: Usuario = {
                usuarioId: usuarioAtual.uid,
                email: usuarioAtual.email || '',
                nome,
                data_criacao: new Date().toISOString(),
            };
            await set(usuarioRef, usuario);
        } else {
            throw new Error('Usuário não autenticado.');
        }
    } catch (error) {
        throw error;
    }
};

export const obterUsuario = async (): Promise<Usuario> => {
    try {
        const usuarioAtual = auth.currentUser;
        if (usuarioAtual) {
            const usuarioRef = ref(database, `usuarios/${usuarioAtual.uid}`);
            const snapshot = await get(usuarioRef);
            if (snapshot.exists()) {
                return snapshot.val() as Usuario;
            } else {
                throw new Error('Usuário não encontrado no banco de dados.');
            }
        } else {
            throw new Error('Usuário não autenticado.');
        }
    } catch (error) {
        throw error;
    }
};