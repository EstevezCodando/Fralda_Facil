import { app } from '@/config/firebase';
import { getDatabase, ref, set, get, update, push } from 'firebase/database';

const database = getDatabase(app);

export interface FraldaEstoque {
    estoqueId?: string | null;
    usuarioId: string;
    fraldaId: string;
    quantidade: number;
    limite_minimo: number;
}

export const obterEstoqueUsuario = async (usuarioId: string): Promise<FraldaEstoque[]> => {
    try {
        const snapshot = await get(ref(database, `fraldas_estoque/${usuarioId}`));
        const estoque: FraldaEstoque[] = [];
        snapshot.forEach((childSnapshot) => {
            estoque.push({
                estoqueId: childSnapshot.key,
                ...childSnapshot.val(),
            });
        });
        return estoque;
    } catch (error) {
        throw error;
    }
};

export const decrementarEstoque = async (
    usuarioId: string,
    fraldaId: string,
    quantidade: number = 1
) => {
    try {
        const estoqueRef = ref(database, `fraldas_estoque/${usuarioId}/${fraldaId}/quantidade`);
        const snapshot = await get(estoqueRef);
        if (snapshot.exists()) {
            const quantidadeAtual = snapshot.val();
            const novaQuantidade = quantidadeAtual - quantidade;
            await update(ref(database, `fraldas_estoque/${usuarioId}/${fraldaId}`), {
                quantidade: novaQuantidade >= 0 ? novaQuantidade : 0,
            });
        } else {
            throw new Error('Estoque não encontrado.');
        }
    } catch (error) {
        throw error;
    }
};

export const registrarUsoFralda = async (
    usuarioId: string,
    fraldaId: string,
    quantidade: number = 1
) => {
    try {
        // Decrementa o estoque
        await decrementarEstoque(usuarioId, fraldaId, quantidade);

        // Registra o uso
        const usoRef = ref(database, `fraldas_usadas/${usuarioId}`);
        const novoUsoRef = push(usoRef);
        await set(novoUsoRef, {
            fraldaId,
            quantidade,
            data_uso: new Date().toISOString(),
        });
    } catch (error) {
        throw error;
    }
};
