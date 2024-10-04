import React from 'react';
import { TextInput as RNTextInput, HelperText } from 'react-native-paper';

interface TextInputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    error?: boolean;
    errorMessage?: string;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    style?: object;
}

const TextInput = ({
                       label,
                       value,
                       onChangeText,
                       error,
                       errorMessage,
                       secureTextEntry,
                       keyboardType,
                       autoCapitalize,
                       style,
                   }: TextInputProps) => {
    return (
        <>
            <RNTextInput
                label={label}
                value={value}
                onChangeText={onChangeText}
                error={error}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                style={style}
                mode="outlined"
            />
            {error && errorMessage ? (
                <HelperText type="error" visible={error}>
                    {errorMessage}
                </HelperText>
            ) : null}
        </>
    );
};

TextInput.defaultProps = {
    error: false,
    secureTextEntry: false,
    keyboardType: 'default',
    autoCapitalize: 'none',
    style: {},
};

export default TextInput;
