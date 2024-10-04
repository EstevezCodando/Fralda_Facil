import { app } from '../config/firebase';
import { getDatabase, ref, push, get, set, update, remove, DataSnapshot } from 'firebase/database';

const database = getDatabase(app);


export interface Mercado {
    mercadoId: string;
    nome: string;
    endereco: string;
}


export interface MercadoInput {
    nome: string;
    endereco: string;
}


export class MercadoService {
    private dbRef = ref(database, 'mercados');


    async adicionarMercado(mercado: MercadoInput): Promise<Mercado> {
        const novoMercadoRef = push(this.dbRef);
        const mercadoId = novoMercadoRef.key;

        if (!mercadoId) {
            throw new Error('Falha ao gerar um ID para o novo mercado.');
        }

        const novoMercado: Mercado = {
            mercadoId,
            ...mercado,
        };

        await set(novoMercadoRef, novoMercado);

        return novoMercado;
    }


    async listarMercados(): Promise<Mercado[]> {
        const snapshot = await get(this.dbRef);
        const mercados: Mercado[] = [];

        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const mercado = childSnapshot.val();
                mercados.push(mercado);
            });
        }

        return mercados;
    }


    async obterMercado(mercadoId: string): Promise<Mercado | null> {
        const snapshot = await get(ref(database, `mercados/${mercadoId}`));

        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            return null;
        }
    }


    async atualizarMercado(mercadoId: string, dadosAtualizados: MercadoInput): Promise<void> {
        await update(ref(database, `mercados/${mercadoId}`), dadosAtualizados);
    }


    async removerMercado(mercadoId: string): Promise<void> {
        await remove(ref(database, `mercados/${mercadoId}`));
    }
}
