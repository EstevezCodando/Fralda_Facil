import { useState, useEffect } from 'react';
import { obterUsuario, Usuario } from '@/services/usuarios';
import { getDownloadURL, ref, getStorage } from 'firebase/storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Adicionar autenticação

export const useUsuario = () => {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [imagemPerfil, setImagemPerfil] = useState<string | null>(null);
    const [autenticado, setAutenticado] = useState(false); // Estado de autenticação

    useEffect(() => {
        let isMounted = true;
        const auth = getAuth();

        // Verificar se o usuário está autenticado
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setAutenticado(true);
                try {
                    const dadosUsuario = await obterUsuario();
                    if (isMounted) {
                        setUsuario(dadosUsuario);
                        if (dadosUsuario?.imagemPerfil) {
                            const storage = getStorage();
                            const imageRef = ref(storage, dadosUsuario.imagemPerfil);
                            const url = await getDownloadURL(imageRef);
                            setImagemPerfil(url);
                        }
                    }
                } catch (error) {
                    console.error('Erro ao obter o usuário:', error);
                } finally {
                    if (isMounted) {
                        setCarregando(false);
                    }
                }
            } else {
                // Se não houver usuário autenticado
                setAutenticado(false);
                setUsuario(null);
                setCarregando(false);
            }
        });

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, []);

    return { usuario, imagemPerfil, setImagemPerfil, carregando, autenticado };
};
