import { CameraView, useCameraPermissions } from 'expo-camera';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dialog, Fab, Modal } from "@/components";

// Defina corretamente as props do componente Camera
type CameraProps = {
    setCameraVisible: (visible: boolean) => void;
    onCapture: (photo: any) => void;
};

const Camera = forwardRef(({ setCameraVisible, onCapture }: CameraProps, ref) => {
    const [permission, requestPermission] = useCameraPermissions();
    const [dialogGrantCamera, setDialogGrantCamera] = useState(true);
    const [cameraRef, setCameraRef] = useState<CameraView | null>(null); // Corrige o tipo do estado

    const closeCamera = () => {
        setCameraVisible(false);
    };

    useImperativeHandle(ref, () => ({
        takePicture: async () => {
            if (cameraRef) {
                try {
                    const photo = await cameraRef.takePictureAsync({
                        base64: false,
                        quality: 1,
                    });
                    onCapture(photo);
                    closeCamera();
                } catch (error) {
                    console.error("Erro ao capturar a foto:", error);
                }
            }
        },
    }));

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <Dialog
                icon={"alert"}
                title={"Permitir câmera"}
                text={"Deseja permitir que o aplicativo acesse sua câmera?"}
                visible={dialogGrantCamera}
                setVisibility={setDialogGrantCamera}
                onDismiss={() => setDialogGrantCamera(false)}
                actions={[
                    {
                        text: "Cancelar",
                        onPress: () => {
                            setDialogGrantCamera(false);
                            setCameraVisible(false);
                        },
                    },
                    {
                        text: "Permitir",
                        onPress: async () => {
                            await requestPermission();
                            setDialogGrantCamera(false);
                            setCameraVisible(true);
                        },
                    },
                ]}
            />
        );
    }

    return (
        <Modal style={styles.container}>
            <CameraView
                ref={(ref) => setCameraRef(ref)} // Corrige a referência
                style={styles.camera}
                facing="back"
            >
                <Fab onPress={closeCamera} icon="close" style={styles.closeButton} />
                <View style={styles.buttonContainer}>
                    {cameraRef && (
                        <Fab
                            onPress={() => cameraRef.takePictureAsync()} // Corrige a chamada do método
                            icon="camera"
                            style={styles.takePicture}
                        />
                    )}
                </View>
            </CameraView>
        </Modal>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
    closeButton: {
        position: "absolute",
        zIndex: 999,
        top: 10,
        right: 10,
        borderRadius: 100,
    },
    takePicture: {
        borderRadius: 100,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        position: "relative",
        flex: 1,
        flexDirection: "row",
        backgroundColor: "transparent",
        margin: 64,
    },
});

export default Camera;
