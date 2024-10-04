import { app } from '../config/firebase';
import { uploadImage } from './firebase/storage';
import { getDatabase, ref, push, get, set, update, remove } from 'firebase/database';

const database = getDatabase(app);

export interface Marca {
    marcaId?: string | null;
    nome: string;
    imagemUri?: string | null;
}

export const adicionarMarca = async (marca: Marca): Promise<Marca> => {
    try {
        if (marca.imagemUri) {
            const imageUrl = await uploadImage(marca.imagemUri, `marcas/${marca.marcaId}`);
            marca.imagemUri = imageUrl;
        }

        const novaMarcaRef = push(ref(database, 'marcas'));
        marca.marcaId = novaMarcaRef.key;
        await set(novaMarcaRef, marca);
        return marca;
    } catch (error) {
        throw error;
    }
};

export const listarMarcas = async (): Promise<Marca[]> => {
    try {
        const snapshot = await get(ref(database, 'marcas'));
        const marcas: Marca[] = [];
        snapshot.forEach((childSnapshot) => {
            marcas.push({
                marcaId: childSnapshot.key,
                ...childSnapshot.val(),
            });
        });
        return marcas;
    } catch (error) {
        throw error;
    }
};

export const obterMarca = async (marcaId: string): Promise<Marca | null> => {
    try {
        const snapshot = await get(ref(database, `marcas/${marcaId}`));
        if (snapshot.exists()) {
            return {
                marcaId,
                ...snapshot.val(),
            };
        } else {
            return null;
        }
    } catch (error) {
        throw error;
    }
};

export const atualizarMarca = async (marcaId: string, dadosAtualizados: Partial<Marca>) => {
    try {
        await update(ref(database, `marcas/${marcaId}`), dadosAtualizados);
    } catch (error) {
        throw error;
    }
};

export const removerMarca = async (marcaId: string) => {
    try {
        await remove(ref(database, `marcas/${marcaId}`));
    } catch (error) {
        throw error;
    }
};
