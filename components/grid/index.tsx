import * as React from 'react';
import { Surface } from 'react-native-paper';
import { StyleSheet, View, ViewStyle, Dimensions } from 'react-native';

// Obtendo as dimensões da tela para ajustar responsivamente
const { width } = Dimensions.get('window');

interface GridProps {
    elevation?: number | null;
    styleSurface?: ViewStyle;
    style?: ViewStyle;
    children: React.ReactNode;
}

// Componente Grid com memo e responsividade
const Grid: React.FC<GridProps> = React.memo(({ elevation, styleSurface, style, children }) => {
    const renderGrid = () => {
        // Se elevation for passado, renderizamos o Surface
        if (elevation) {
            return (
                <Surface
                    style={{
                        ...styles.surface,
                        ...styleSurface,
                        width: width * 0.9  // Responsividade baseada na largura da tela
                    }}
                    // @ts-ignore
                    elevation={elevation}
                >
                    <View style={{ width: '100%', ...style }}>
                        {children}
                    </View>
                </Surface>
            );
        } else {
            // Caso contrário, renderizamos apenas a View
            return (
                <View style={{ width: '100%', ...style }}>
                    {children}
                </View>
            );
        }
    };

    return renderGrid();
});

// Estilos padrão do componente
const styles = StyleSheet.create({
    surface: {
        padding: 8,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

Grid.defaultProps = {
    elevation: null,
    styleSurface: {},
    style: {},
};

export default Grid;
