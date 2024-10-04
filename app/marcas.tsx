import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, Image, TouchableOpacity, Text } from 'react-native';
import { TextInput, Button, Card, Title, IconButton, Dialog, Portal, Paragraph } from 'react-native-paper';
import { Avatar, Header } from '@/components';
import { listarMarcas, adicionarMarca, atualizarMarca, removerMarca, Marca } from '@/services/marcas';
import ImagePickerComponent from '@/components/ImagePickerComponent';

const TelaMarcas = () => {
    const [nome, setNome] = useState('');
    const [busca, setBusca] = useState('');
    const [marcas, setMarcas] = useState<Marca[]>([]);
    const [marcasFiltradas, setMarcasFiltradas] = useState<Marca[]>([]);
    const [imagemUri, setImagemUri] = useState<string | null>(null);  // Armazena a URI da imagem
    const [marcaParaEditar, setMarcaParaEditar] = useState<Marca | null>(null);
    const [dialogoVisivel, setDialogoVisivel] = useState(false);
    const [dialogExcluirVisivel, setDialogExcluirVisivel] = useState(false);
    const [marcaIdParaExcluir, setMarcaIdParaExcluir] = useState<string | null>(null);

    useEffect(() => {
        carregarMarcas();
    }, []);

    useEffect(() => {
        filtrarMarcas();
    }, [busca, marcas]);

    const carregarMarcas = async () => {
        try {
            const lista = await listarMarcas();
            setMarcas(lista);
        } catch (error) {
            console.error(error);
        }
    };

    const handleExcluirMarca = (marcaId: string) => {
        setMarcaIdParaExcluir(marcaId);
        setDialogExcluirVisivel(true); // Mostra o diálogo de confirmação
    };

    const confirmarExcluirMarca = async () => {
        if (marcaIdParaExcluir) {
            try {
                await removerMarca(marcaIdParaExcluir);
                setDialogExcluirVisivel(false);
                setMarcaIdParaExcluir(null);
                carregarMarcas();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleEditarMarca = async () => {
        if (marcaParaEditar && nome) {
            try {
                const dadosAtualizados: Partial<Marca> = { nome };
                if (imagemUri) {
                    dadosAtualizados.imagemUri = imagemUri;
                }
                await atualizarMarca(marcaParaEditar.marcaId as string, dadosAtualizados);
                setMarcaParaEditar(null);
                setNome('');
                setImagemUri(null);
                setDialogoVisivel(false);
                carregarMarcas();
            } catch (error) {
                console.error(error);
            }
        } else {
            Alert.alert('Erro', 'Por favor, preencha o campo nome.');
        }
    };

    const filtrarMarcas = () => {
        const filtradas = marcas.filter((marca) =>
            marca.nome.toLowerCase().includes(busca.toLowerCase())
        );
        setMarcasFiltradas(filtradas);
    };

    const handleAdicionarMarca = async () => {
        if (!nome) {
            Alert.alert('Erro', 'Por favor, preencha o campo nome.');
            return;
        }
        try {
            const novaMarca: Marca = { nome, imagemUri };
            await adicionarMarca(novaMarca);
            setNome('');
            setImagemUri(null);
            carregarMarcas();
        } catch (error) {
            console.error(error);
        }
    };

    const abrirDialogoEdicao = (marca: Marca) => {
        setMarcaParaEditar(marca);
        setNome(marca.nome);
        setImagemUri(marca.imagemUri || null);
        setDialogoVisivel(true);
    };

    const fecharDialogoEdicao = () => {
        setMarcaParaEditar(null);
        setNome('');
        setDialogoVisivel(false);
    };

    const renderItem = ({ item }: { item: Marca }) => (
        <Card style={styles.card}>
            <View style={styles.cardContent}>
                {item.imagemUri ? (
                    <Image source={{ uri: item.imagemUri }} style={styles.imagemMarca} />
                ) : null}
                <View style={styles.textContainer}>
                    <Text style={styles.marcaNome}>{item.nome}</Text>
                </View>
            </View>
            <Card.Actions>
                <IconButton
                    icon="pencil"
                    onPress={() => abrirDialogoEdicao(item)}
                />
                <IconButton
                    icon="delete"
                    onPress={() => handleExcluirMarca(item.marcaId as string)}
                />
            </Card.Actions>
        </Card>
    );

    return (
        <View style={styles.container}>
            <Header title="Gerencie as Marcas" showBackAction={true} />

            <View style={styles.headerContainer}>
                <Avatar
                    source={require('../assets/images/Marcas.png')}
                    size={100}
                    style={styles.avatar}
                />
                <Title style={styles.title}>Adicione uma nova Marca</Title>
            </View>

            <View style={styles.formulario}>
                <TextInput
                    label="Nome da marca"
                    value={nome}
                    onChangeText={setNome}
                    style={styles.input}
                />
                <ImagePickerComponent onImageSelected={setImagemUri} />
                {imagemUri ? <Image source={{ uri: imagemUri }} style={styles.imagemPreview} /> : null}
                <TouchableOpacity onPress={handleAdicionarMarca} style={styles.botao}>
                    <Button mode="contained"  style={styles.botao}>
                        Adicionar
                    </Button>
                </TouchableOpacity>
            </View>

            <TextInput
                label="Buscar Marcas"
                value={busca}
                onChangeText={setBusca}
                style={styles.inputBusca}
            />

            <FlatList
                data={marcasFiltradas}
                keyExtractor={(item) => item.marcaId as string}
                renderItem={renderItem}
                contentContainerStyle={styles.lista}
            />

            {/* Diálogo de edição */}
            <Portal>
                <Dialog visible={dialogoVisivel} onDismiss={fecharDialogoEdicao}>
                    <Dialog.Title>Editar Marca</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            label="Nome da marca"
                            value={nome}
                            onChangeText={setNome}
                            style={styles.input}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={fecharDialogoEdicao}>Cancelar</Button>
                        <Button onPress={handleEditarMarca}>Salvar</Button>
                    </Dialog.Actions>
                </Dialog>

                {/* Diálogo de exclusão */}
                <Dialog visible={dialogExcluirVisivel} onDismiss={() => setDialogExcluirVisivel(false)}>
                    <Dialog.Title>Confirmação</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>Deseja realmente excluir esta marca?</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setDialogExcluirVisivel(false)}>Cancelar</Button>
                        <Button onPress={confirmarExcluirMarca}>Excluir</Button>
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
        padding: 10,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    imagemMarca: {
        width: 80,
        height: 80,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    marcaNome: {
        fontSize: 18,
        fontWeight: 'bold',
        textDecorationLine: 'underline', // Nome sublinhado
    },
    imagemPreview: {
        width: 100,
        height: 100,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
    },
});

export default TelaMarcas;
