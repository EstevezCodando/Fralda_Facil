// FraldaFacil/components/snackbar/index.tsx
import * as React from 'react';
import { Snackbar as PaperSnackBar } from 'react-native-paper';
import { ViewStyle } from 'react-native';

// Definindo as props do SnackBar
interface SnackBarProps {
    visible: boolean;
    onDismiss: () => void;
    message: string;
    duration?: number; // Duração da exibição em milissegundos
    style?: ViewStyle;  // Estilo customizável
}

// Componente SnackBar utilizando memo para evitar renderizações desnecessárias
const SnackBar: React.FC<SnackBarProps> = React.memo(({
                                                          visible,
                                                          onDismiss,
                                                          message,
                                                          duration = 3000,  // Duração padrão de 3 segundos
                                                          style = {},  // Estilo padrão
                                                      }) => {
    return (
        <PaperSnackBar
            visible={visible}
            onDismiss={onDismiss}
            duration={duration}
            style={style}
            action={{
                label: 'Fechar',
                onPress: onDismiss,
            }}
        >
            {message}
        </PaperSnackBar>
    );
});

export default SnackBar;
