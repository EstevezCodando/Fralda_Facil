import React, { useEffect, useState } from 'react';
import * as Network from 'expo-network';
import { useRouter } from 'expo-router';

function NetworkChecker({ children }: { children: React.ReactNode }) {
    const [isConnected, setIsConnected] = useState(true);
    const router = useRouter(); // useRouter do expo-router para navegação

    useEffect(() => {
        const checkConnection = async () => {
            const networkStatus = await Network.getNetworkStateAsync();
            setIsConnected(networkStatus.isConnected ?? false);

            if (!networkStatus.isConnected) {
                router.replace('/noInternet'); // Redireciona para a tela noInternet
            } else {
                router.replace('/home'); // Redireciona para a Home quando a conexão voltar
            }
        };

        checkConnection();

        // Monitora a conexão a cada 5 segundos
        const intervalId = setInterval(checkConnection, 5000);

        return () => clearInterval(intervalId);
    }, [router]);

    return <>{children}</>;
}

export default NetworkChecker;
