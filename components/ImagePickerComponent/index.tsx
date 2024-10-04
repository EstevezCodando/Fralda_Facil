import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native'; // Removendo Image já que ele será exibido na tela principal
import * as ImagePicker from 'expo-image-picker';
import {Button} from "react-native-paper";

const ImagePickerComponent = ({ onImageSelected }: { onImageSelected: (uri: string | null) => void }) => {
    const selecionarImagem = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            onImageSelected(result.assets[0].uri);
        }
    };

    return (
        <TouchableOpacity onPress={selecionarImagem} style={{ padding: 15}}>
            <Button mode="contained"  style={styles.botao}>
               Selecione uma imagem
            </Button>
        </TouchableOpacity>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    botao: {
        marginTop: 8,
    }
});

export default ImagePickerComponent;
