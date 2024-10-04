import React, { useState, useRef } from 'react';
import { View, Button, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera'; // Supondo que esse seja o caminho correto para CameraView

export default function CameraPage() {
    const [cameraVisible, setCameraVisible] = useState(false); // Controla a exibição da câmera
    const [photoUri, setPhotoUri] = useState<string | null>(null); // Armazena a URI da foto capturada
    const cameraRef = useRef(null); // Referência para a câmera
    const [permission, requestPermission] = useCameraPermissions(); // Verifica e solicita permissão

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>Precisamos de sua permissão para usar a câmera</Text>
                <Button title="Conceder Permissão" onPress={requestPermission} />
            </View>
        );
    }

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync(); // Chama o método de captura de foto
                setPhotoUri(photo.uri); // Armazena a URI da foto capturada
            } catch (error) {
                console.error('Erro ao capturar a foto:', error);
            }
        }
    };

    return (
        <View style={styles.container}>
            {!cameraVisible ? (
                <Button title="Abrir Câmera" onPress={() => setCameraVisible(true)} />
            ) : (
                <>
                    {photoUri ? (
                        <View>
                            <Image source={{ uri: photoUri }} style={styles.photo} />
                            <Button title="Tirar outra foto" onPress={() => setPhotoUri(null)} />
                        </View>
                    ) : (
                        <CameraView style={styles.camera} facing="back" ref={cameraRef}>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.button} onPress={takePicture}>
                                    <Text style={styles.text}>Capturar Foto</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button} onPress={() => setCameraVisible(false)}>
                                    <Text style={styles.text}>Fechar Câmera</Text>
                                </TouchableOpacity>
                            </View>
                        </CameraView>
                    )}
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
        width: '100%',
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'center',
        margin: 20,
    },
    button: {
        flex: 0.2,
        alignSelf: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 10,
        marginHorizontal: 5,
        borderRadius: 5,
    },
    text: {
        fontSize: 18,
        color: 'black',
    },
    photo: {
        width: 300,
        height: 400,
        borderRadius: 10,
    },
});
