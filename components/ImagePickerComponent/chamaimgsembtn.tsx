import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ImagePickerComponentSBtn = ({ onImageSelected }: { onImageSelected: (uri: string | null) => void }) => {
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
        } else {
            onImageSelected(null);
        }
    };

    useEffect(() => {
        selecionarImagem();
    }, []);

    return (
        <View>

        </View>
    );
};

export default ImagePickerComponentSBtn;
