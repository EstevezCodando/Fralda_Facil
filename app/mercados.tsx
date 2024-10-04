import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Appbar, TextInput, Button, Card, Title, IconButton, Dialog, Portal, useTheme, Paragraph  } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Avatar, Header } from '@/components';
import { MercadoService, Mercado, MercadoInput } from '@/services/mercados';



const TelaMercados = () => {
    const [nome, setNome] = useState('');
    const [endereco, setEndereco] = useState('');
    const [busca, setBusca] = useState('');
    const [mercados, setMercados] = useState<Mercado[]>([]);
    const [mercadosFiltrados, setMercadosFiltrados] = useState<Mercado[]>([]);
    const [mercadoParaEditar, setMercadoParaEditar] = useState<Mercado | null>(null);
    const [dialogoVisivel, setDialogoVisivel] = useState(false);
    const [dialogExcluirVisivel, setDialogExcluirVisivel] = useState(false);
    const [mercadoIdParaExcluir, setMercadoIdParaExcluir] = useState<string | null>(null);

    const router = useRouter();
    const theme = useTheme();
    const mercadoService = new MercadoService();

    useEffect(() => {
        carregarMercados();
    }, []);

    useEffect(() => {
        filtrarMercados();
    }, [busca, mercados]);

    const carregarMercados = async () => {
        try {
            const lista = await mercadoService.listarMercados();
            setMercados(lista);
        } catch (error) {
            console.error(error);
        }
    };

    const filtrarMercados = () => {
        const filtrados = mercados.filter((mercado) =>
            mercado.nome.toLowerCase().includes(busca.toLowerCase())
        );
        setMercadosFiltrados(filtrados);
    };

    const handleAdicionarMercado = async () => {
        if (!nome || !endereco) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }
        try {
            const novoMercado: MercadoInput = { nome, endereco };
            await mercadoService.adicionarMercado(novoMercado);
            setNome('');
            setEndereco('');
            carregarMercados();
        } catch (error) {
            console.error(error);
        }
    };


    const handleEditarMercado = async () => {
        if (mercadoParaEditar && nome && endereco) {
            try {
                const dadosAtualizados: MercadoInput = { nome, endereco };
                await mercadoService.atualizarMercado(mercadoParaEditar.mercadoId, dadosAtualizados);
                setMercadoParaEditar(null);
                setNome('');
                setEndereco('');
                setDialogoVisivel(false);
                carregarMercados();
            } catch (error) {
                console.error(error);
            }
        } else {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
        }
    };

    const handleExcluirMercado = (mercadoId: string) => {
        setMercadoIdParaExcluir(mercadoId);
        setDialogExcluirVisivel(true);
    };

    const confirmarExcluirMercado = async () => {
        if (mercadoIdParaExcluir) {
            try {
                await mercadoService.removerMercado(mercadoIdParaExcluir);
                setDialogExcluirVisivel(false);
                setMercadoIdParaExcluir(null);
                carregarMercados();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const abrirDialogoEdicao = (mercado: Mercado) => {
        setMercadoParaEditar(mercado);
        setNome(mercado.nome);
        setEndereco(mercado.endereco);
        setDialogoVisivel(true);
    };

    const fecharDialogoEdicao = () => {
        setMercadoParaEditar(null);
        setNome('');
        setEndereco('');
        setDialogoVisivel(false);
    };

    const renderItem = ({ item }: { item: Mercado }) => (
        <Card style={styles.card}>
            <Card.Title title={item.nome} subtitle={item.endereco} />
            <Card.Actions>
                <IconButton
                    icon="pencil"
                    onPress={() => abrirDialogoEdicao(item)}
                />
                <IconButton
                    icon="delete"
                    onPress={() => handleExcluirMercado(item.mercadoId)}
                />
            </Card.Actions>
        </Card>
    );

    return (
        <View style={styles.container}>
            <Header title="Gerencie os Mercados" showBackAction={true} />

            <View style={styles.headerContainer}>
                <Avatar
                    source={require('../assets/images/Mercado.png')}
                    size={100}
                    style={styles.avatar}
                />
                <Title style={styles.title}>Adicionar Mercado</Title>
            </View>

            <View style={styles.formulario}>
                <TextInput
                    label="Nome"
                    value={nome}
                    onChangeText={setNome}
                    style={styles.input}
                />
                <TextInput
                    label="Endereço"
                    value={endereco}
                    onChangeText={setEndereco}
                    style={styles.input}
                />
                <Button mode="contained" onPress={handleAdicionarMercado} style={styles.botao}>
                    Adicionar
                </Button>
            </View>

            <TextInput
                label="Buscar Mercados"
                value={busca}
                onChangeText={setBusca}
                style={styles.inputBusca}
            />

            <FlatList
                data={mercadosFiltrados}
                keyExtractor={(item) => item.mercadoId}
                renderItem={renderItem}
                contentContainerStyle={styles.lista}
            />

            {/* Dialogo de Edição */}
            <Portal>
                <Dialog visible={dialogoVisivel} onDismiss={fecharDialogoEdicao}>
                    <Dialog.Title>Editar Mercado</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            label="Nome"
                            value={nome}
                            onChangeText={setNome}
                            style={styles.input}
                        />
                        <TextInput
                            label="Endereço"
                            value={endereco}
                            onChangeText={setEndereco}
                            style={styles.input}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={fecharDialogoEdicao}>Cancelar</Button>
                        <Button onPress={handleEditarMercado}>Salvar</Button>
                    </Dialog.Actions>
                </Dialog>

                <Dialog visible={dialogExcluirVisivel} onDismiss={() => setDialogExcluirVisivel(false)}>
                    <Dialog.Title>Confirmação</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>Deseja realmente excluir este mercado?</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setDialogExcluirVisivel(false)}>Cancelar</Button>
                        <Button onPress={confirmarExcluirMercado}>Excluir</Button>
                    </Dialog.Actions>
                </Dialog>

            </Portal>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    avatar: {
        backgroundColor: 'transparent',
    },
    title: {
        marginTop: 10,
        fontSize: 24,
    },
    formulario: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    input: {
        marginBottom: 8,
    },
    botao: {
        marginTop: 8,
    },
    inputBusca: {
        marginHorizontal: 16,
        marginBottom: 8,
    },
    lista: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    card: {
        marginBottom: 8,
    },
});

export default TelaMercados;
