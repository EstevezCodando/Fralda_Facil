import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import Button from '../components/button';
import TextInput from '../components/textinput';
import { adicionarFralda } from '../services/fraldas';

interface TelaAdicionarFraldaProps {
    onClose: () => void;
}

const TelaAdicionarFralda = ({ onClose }: TelaAdicionarFraldaProps) => {
    const [marcaId, setMarcaId] = useState('');
    const [tamanho, setTamanho] = useState('');
    const [qualidade, setQualidade] = useState('');
    const [carregando, setCarregando] = useState(false);

    const handleAdicionarFralda = async () => {
        try {
            setCarregando(true);
            await adicionarFralda({
                marcaId,
                tamanho,
                qualidade,
            });
            onClose(); // Fecha o modal após adicionar a fralda
        } catch (error) {
            console.error(error);
        } finally {
            setCarregando(false);
        }
    };

    return (
        <View style={estilos.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={onClose} />
                <Appbar.Content title="Adicionar Fralda" />
            </Appbar.Header>
            <View style={estilos.formContainer}>
                <TextInput
                    label="Marca"
                    value={marcaId}
                    onChangeText={setMarcaId}
                    style={estilos.input}
                />
                <TextInput
                    label="Tamanho"
                    value={tamanho}
                    onChangeText={setTamanho}
                    style={estilos.input}
                />
                <TextInput
                    label="Qualidade"
                    value={qualidade}
                    onChangeText={setQualidade}
                    style={estilos.input}
                />
                <Button
                    onPress={handleAdicionarFralda}
                    loading={carregando}
                    style={estilos.botaoAdicionar}
                >
                    Adicionar
                </Button>
                <Button onPress={onClose} mode="text" style={estilos.botaoCancelar}>
                    Cancelar
                </Button>
            </View>
        </View>
    );
};

const estilos = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    formContainer: {
        padding: 20,
    },
    input: {
        marginBottom: 10,
    },
    botaoAdicionar: {
        marginTop: 10,
    },
    botaoCancelar: {
        marginTop: 10,
    },
});

export default TelaAdicionarFralda;
