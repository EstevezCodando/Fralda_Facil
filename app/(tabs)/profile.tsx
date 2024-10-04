import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Platform, Alert, Image } from 'react-native';
import { TextInput, Button, Dialog, Portal, FAB } from 'react-native-paper';
import { Header, Avatar, Grid, Fab, Camera, ImagePickerComponent } from '@/components';
import { useUsuario } from '@/hooks/useUsuario';
import ImagePickerComponentSBtn from '@/components/ImagePickerComponent/chamaimgsembtn';
import { salvarBebe, obterBebe, Bebe } from '@/services/bebes';
import { uploadImageAsync } from '@/services/firebase/storage';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useAuth } from '@/services/AuthContext';
import { getDatabase, ref, update } from 'firebase/database'



const PerfilScreen = () => {
    const { usuario, carregando } = useUsuario();
    const [imagemPerfil, setImagemPerfil] = useState<string | null>(null);
    const [imagemBebe, setImagemBebe] = useState<string | null>(null);
    const [nomeBebe, setNomeBebe] = useState('');
    const [semanasBebe, setSemanasBebe] = useState('');
    const [pesoBebe, setPesoBebe] = useState('');
    const [dialogBebeVisivel, setDialogBebeVisivel] = useState(false);
    const [dialogEditarVisivel, setDialogEditarVisivel] = useState(false);
    const [dadosBebeCarregados, setDadosBebeCarregados] = useState(false);
    const [showImagePicker, setShowImagePicker] = useState(false);
    const { user, updateUser } = useAuth();
    const [nomeUsuario, setNomeUsuario] = useState(user?.nome || '');
    const [cameraVisible, setCameraVisible] = useState(false);
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const cameraRef = useRef(null);

    const carregarDadosBebe = async () => {
        try {
            const dadosBebe = await obterBebe();
            if (dadosBebe) {
                setNomeBebe(dadosBebe.nome);
                setSemanasBebe(dadosBebe.semanas);
                setPesoBebe(dadosBebe.peso);
                if (dadosBebe.imagemUri) setImagemBebe(dadosBebe.imagemUri);
                setDadosBebeCarregados(true);
            } else {
                console.log("Nenhum dado do bebê foi encontrado.");
                // Caso não encontre, abre o diálogo para adicionar um novo bebê
                setDialogBebeVisivel(true);
            }
        } catch (error) {
            console.error('Erro ao carregar dados do bebê:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao carregar os dados do bebê.');
        }
    };

    const salvarDadosBebe = async () => {
        if (!nomeBebe || !semanasBebe || !pesoBebe) {
            Alert.alert('Erro', 'Por favor, preencha todas as informações do bebê.');
            return;
        }

        try {
            let imagemUriSalva = imagemBebe;
            if (imagemBebe && imagemBebe.startsWith('file://')) {
                imagemUriSalva = await uploadImageAsync(imagemBebe, `bebes/${usuario?.usuarioId}/imagemBebe.jpg`);
            }

            const bebe: Bebe = {
                nome: nomeBebe,
                semanas: semanasBebe,
                peso: pesoBebe,
                imagemUri: imagemUriSalva,
            };

            await salvarBebe(bebe);
            setDialogBebeVisivel(false);
            Alert.alert('Sucesso', 'Informações do bebê salvas com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar os dados do bebê:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao salvar os dados do bebê.');
        }
    };

    const takePicture = async () => {
        if (cameraRef.current) {
            try {

                // @ts-ignore
                const photo = await cameraRef.current.takePictureAsync();
                setPhotoUri(photo.uri);
                setCameraVisible(false);
            } catch (error) {
                console.error('Erro ao capturar a foto:', error);
            }
        }
    };


    const salvarNomeUsuario = async () => {
        if (!nomeUsuario) {
            Alert.alert('Erro', 'O nome do usuário não pode estar vazio.');
            return;
        }
        try {

            await updateUser(nomeUsuario);
            Alert.alert('Sucesso', 'Nome do usuário atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar o nome do usuário:', error);
        }
    };

    const handleImageSelected = async (uri: string | null) => {
        if (uri) {
            try {
                const downloadUrl = await uploadImageAsync(uri, `usuarios/${usuario?.usuarioId}/perfil.jpg`);
                const database = getDatabase();

                const usuarioRef = ref(database, `usuarios/${usuario?.usuarioId}`);
                await update(usuarioRef, { imagemPerfil: downloadUrl });

                setImagemPerfil(downloadUrl);
            } catch (error) {
                console.error('Erro ao salvar a imagem do perfil:', error);
            }
        }
    };

    const abrirImagePicker = () => {
        setShowImagePicker(true);
    };

    return (
        <View style={{ flex: 1 }}>
            {cameraVisible && (
                <View style={styles.fullScreenCamera}>
                    <CameraView
                        style={styles.camera}
                        ref={cameraRef}
                        facing="back"
                    >
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.buttonfoto} onPress={takePicture}>
                                <Text style={styles.text}>Foto</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonfoto} onPress={() => setCameraVisible(false)}>
                                <Text style={styles.text}>Fechar Câmera</Text>
                            </TouchableOpacity>
                        </View>
                    </CameraView>
                </View>
            )}

            {!cameraVisible && (
        <ScrollView style={styles.scrollContainer}>
            <Grid>
                <Grid>
                    <Header title={`Perfil: ${user?.nome}`} showBackAction={true} />
                </Grid>
                <Grid>
                    <Grid style={styles.containerImage}>
                        <Grid style={styles.containerCenterImage}>
                            {
                                imagemPerfil
                                    ? <Avatar size={230} source={{ uri: imagemPerfil }} />
                                    : <Avatar size={230} icon="account" />
                            }
                            {Platform.OS !== 'web' ? (
                                <>
                                    <Fab
                                        onPress={abrirImagePicker}
                                        icon="image"
                                        style={[styles.fab, styles.left]}
                                    />
                                    <Fab
                                        onPress={() => setCameraVisible(true)}
                                        icon="camera"
                                        style={[styles.fab, styles.right]}

                                    />
                                </>
                            ) : (
                                <Fab
                                    onPress={abrirImagePicker}
                                    icon="image"
                                    style={[styles.fab, styles.center]}
                                />
                            )}
                        </Grid>
                    </Grid>
                </Grid>



                {/* Informações do usuário */}
                <Grid style={styles.padding}>
                    <TextInput
                        label="Nome"
                        value={nomeUsuario}
                        mode="outlined"
                        style={styles.input}
                        editable={false}
                    />
                    <Button mode="contained" onPress={() => setDialogEditarVisivel(true)} style={styles.button}>
                        Editar Nome
                    </Button>
                    <TextInput
                        label="Email"
                        value={usuario?.email}
                        mode="outlined"
                        style={styles.input}
                        editable={false}
                    />
                </Grid>

                {/* Seção para adicionar bebê */}
                {!dadosBebeCarregados ? (
                    <Button mode="contained" onPress={carregarDadosBebe} style={styles.button}>
                        Carregar Informações do Bebê
                    </Button>
                ) : (
                    <Grid style={styles.padding}>
                        <Text style={styles.sectionTitle}>Meu Bebê</Text>
                        <Avatar size={120} source={imagemBebe ? { uri: imagemBebe } : require('@/assets/images/default-baby.png')} />
                        <TextInput
                            label="Nome do Bebê"
                            value={nomeBebe}
                            mode="outlined"
                            style={styles.input}
                            editable={false}
                        />
                        <TextInput
                            label="Semanas do Bebê"
                            value={semanasBebe}
                            mode="outlined"
                            style={styles.input}
                            editable={false}
                        />
                        <TextInput
                            label="Peso do Bebê"
                            value={pesoBebe}
                            mode="outlined"
                            style={styles.input}
                            editable={false}
                        />
                        <Button mode="contained" onPress={() => setDialogBebeVisivel(true)} style={styles.button}>
                            Editar Informações do Bebê
                        </Button>
                    </Grid>
                )}
                {/* Diálogo para edição do bebê */}
                <Portal>
                    <Dialog visible={dialogBebeVisivel} onDismiss={() => setDialogBebeVisivel(false)}>
                        <Dialog.Title>Adicionar ou Editar Bebê</Dialog.Title>
                        <Dialog.Content>
                            <TextInput
                                label="Nome do Bebê"
                                value={nomeBebe}
                                onChangeText={setNomeBebe}
                                mode="outlined"
                                style={styles.input}
                            />
                            <TextInput
                                label="Semanas do Bebê"
                                value={semanasBebe}
                                onChangeText={setSemanasBebe}
                                mode="outlined"
                                keyboardType="numeric"
                                style={styles.input}
                            />
                            <TextInput
                                label="Peso do Bebê"
                                value={pesoBebe}
                                onChangeText={setPesoBebe}
                                mode="outlined"
                                keyboardType="numeric"
                                style={styles.input}
                            />
                            <ImagePickerComponent onImageSelected={setImagemBebe} />
                            {imagemBebe ? <Image source={{ uri: imagemBebe }} style={styles.imagemPreview} /> : null}
                        </Dialog.Content>
                        <Dialog.Actions>

                            <TouchableOpacity onPress={salvarDadosBebe}>
                                <Button onPress={() => setDialogBebeVisivel(false)}>Cancelar</Button>
                                <Button onPress={salvarDadosBebe}>Salvar</Button>
                            </TouchableOpacity>
                        </Dialog.Actions>
                    </Dialog>

                    {/* Diálogo para editar nome do usuário */}
                    <Dialog visible={dialogEditarVisivel} onDismiss={() => setDialogEditarVisivel(false)}>
                        <Dialog.Title>Editar Nome do Usuário</Dialog.Title>
                        <Dialog.Content>
                            <TextInput
                                label="Nome"
                                value={nomeUsuario}
                                onChangeText={setNomeUsuario}
                                mode="outlined"
                                style={styles.input}
                            />
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => setDialogEditarVisivel(false)}>Cancelar</Button>
                            <Button onPress={salvarNomeUsuario}>Salvar</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </Grid>

        </ScrollView>
            )}
            {showImagePicker && (
                <ImagePickerComponentSBtn
                    onImageSelected={(uri) => {
                        handleImageSelected(uri);
                        setShowImagePicker(false);
                    }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
    },
    fullScreenCamera: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999, // Garante que a câmera esteja sobreposta
        backgroundColor: 'black', // Para cobrir a tela
    },
    containerImage: {
        alignItems: 'center',
        marginTop: 20,
    },
    containerCenterImage: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fab: {
        position: 'absolute',
        bottom: 10,
    },
    left: {
        left: 10,
    },
    right: {
        right: 10,
    },
    center: {
        alignSelf: 'center',
    },
    padding: {
        padding: 16,
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginBottom: 20,
        backgroundColor: '#ADD8E6',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    imagemPreview: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginTop: 10,
    },
    camera: {
        flex: 1,
        width: '100%',
        backgroundColor: '#E0F7FA', // Azul bebê claro para o fundo da câmera
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'center',
        margin: 20,
    },

    text: {
        fontSize: 18,
        color: '#333333', // Cor elegante para o texto
        fontFamily: 'Arial', // Ou outra fonte elegante, se desejar
    },
    photo: {
        width: 300,
        height: 400,
        borderRadius: 20, // Bordas mais arredondadas para a pré-visualização da foto
        marginTop: 10,
        borderColor: '#B3E5FC', // Cor de borda azul bebê
        borderWidth: 2,
    },
    closeButton: {
        position: "absolute",
        zIndex: 999,
        top: 10,
        right: 10,
        backgroundColor: '#E1F5FE', // Fundo azul bebê
        borderRadius: 50, // Botão completamente circular
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    takePicture: {
        borderRadius: 50, // Botão arredondado para capturar a foto
        backgroundColor: '#81D4FA', // Azul bebê mais intenso
        padding: 15,
    },
    buttonText: {
        fontSize: 16,
        color: '#ffffff',
        fontWeight: 'bold',
    },
    buttonfoto: {
        flex: 0.2,
        alignSelf: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#ADD8E6', // Tom de azul bebê para os botões
        padding: 12,
        marginHorizontal: 5,
        borderRadius: 25, // Botões arredondados
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});

export default PerfilScreen;
