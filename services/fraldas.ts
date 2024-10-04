import { app } from '../config/firebase';
import { getDatabase, ref, push, get, child, set } from 'firebase/database';

const database = getDatabase(app);

export interface Fralda {
    fraldaId?: string | null;
    marcaId: string;
    tamanho: string;
    qualidade: string;
}

export const adicionarFralda = async (fralda: Fralda) => {
    try {
        const novaFraldaRef = push(ref(database, 'fraldas'));
        fralda.fraldaId = novaFraldaRef.key;
        await set(novaFraldaRef, fralda);
        return fralda;
    } catch (error) {
        throw error;
    }
};

export const listarFraldas = async (): Promise<Fralda[]> => {
    try {
        const snapshot = await get(ref(database, 'fraldas'));
        const fraldas: Fralda[] = [];
        snapshot.forEach((childSnapshot) => {
            fraldas.push({
                fraldaId: childSnapshot.key,
                ...childSnapshot.val(),
            });
        });
        return fraldas;
    } catch (error) {
        throw error;
    }
};
