import { useState, useEffect } from 'react';
import { obterUsuario, Usuario } from '../services/usuarios';

export const useUsuario = () => {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const carregarUsuario = async () => {
            try {
                const dadosUsuario = await obterUsuario();
                if (isMounted) {
                    setUsuario(dadosUsuario);
                }
            } catch (error) {
                console.error(error);
            } finally {
                if (isMounted) {
                    setCarregando(false);
                }
            }
        };

        carregarUsuario();

        return () => {
            isMounted = false;
        };
    }, []);

    return { usuario, carregando };
};