import { app } from '@/config/firebase';
import { getDatabase, ref, set, get, update } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const database = getDatabase(app);
const storage = getStorage(app);
const auth = getAuth(app);

export interface Bebe {
    nome: string;
    semanas: string;
    peso: string;
    imagemUri?: string | null;
}


export const salvarBebe = async (bebe: Bebe) => {
    const usuarioAtual = auth.currentUser;
    if (usuarioAtual) {
        const bebeRef = ref(database, `bebes/${usuarioAtual.uid}`);
        await set(bebeRef, bebe);
    } else {
        throw new Error('Usuário não autenticado.');
    }
};


export const obterBebe = async (): Promise<Bebe | null> => {
    const usuarioAtual = auth.currentUser;
    if (usuarioAtual) {
        const bebeRef = ref(database, `bebes/${usuarioAtual.uid}`);
        const snapshot = await get(bebeRef);
        if (snapshot.exists()) {
            return snapshot.val() as Bebe;
        } else {
            return null;
        }
    } else {
        throw new Error('Usuário não autenticado.');
    }
};


export const enviarImagemBebe = async (uri: string): Promise<string> => {
    const usuarioAtual = auth.currentUser;
    if (!usuarioAtual) throw new Error('Usuário não autenticado.');

    const response = await fetch(uri);
    const blob = await response.blob();

    const fileRef = storageRef(storage, `bebes/${usuarioAtual.uid}/perfil-bebe.jpg`);
    await uploadBytes(fileRef, blob);
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
};
