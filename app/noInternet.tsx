import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Avatar from '@/components/avatar';
import * as Network from 'expo-network';
import { NavigationProp } from '@react-navigation/native';

interface Props {
    navigation: NavigationProp<any>;
}


export default function NoInternetScreen({ navigation }: Props) {
    const verificarConexao = async () => {
        const networkStatus = await Network.getNetworkStateAsync();
        if (networkStatus.isConnected) {
            navigation.navigate('login');
        } else {
            alert('Ainda sem conexão!');
        }
    };

    return (
        <View style={styles.container}>
            <Avatar
                source={require('../assets/images/baby-sad.png')}
                size={150}
                style={styles.avatar}
            />
            <Text style={styles.text}>A internet já vai voltar</Text>
            <Button title="Verificar se a internet voltou" onPress={verificarConexao} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    avatar: {
        marginBottom: 20,
    },
    text: {
        fontSize: 20,
        marginBottom: 20,
    },
});
