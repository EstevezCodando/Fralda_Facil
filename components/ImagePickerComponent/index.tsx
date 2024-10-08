import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button } from "react-native-paper";

const ImagePickerComponent = ({ onImageSelected }: { onImageSelected: (uri: string | null) => void }) => {
    const [imagemUri, setImagemUri] = useState<string | null>(null);

    const selecionarImagem = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            setImagemUri(uri);
            onImageSelected(uri);
        }
    };

    return (
        <View style={styles.container}>
            <Button mode="contained" onPress={selecionarImagem} style={styles.botao}>
                Selecione uma imagem
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    botao: {
        marginTop: 8,
        padding: 10,
    },
});

export default ImagePickerComponent;
