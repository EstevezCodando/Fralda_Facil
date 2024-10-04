import React from 'react';
import { Button as RNButton } from 'react-native-paper';

interface ButtonProps {
    mode?: 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';
    onPress: () => void;
    children: React.ReactNode;
    disabled?: boolean;
    loading?: boolean;
    icon?: string;
    style?: object;
    contentStyle?: object;
}

const Button = ({
                    mode,
                    onPress,
                    children,
                    disabled,
                    loading,
                    icon,
                    style,
                    contentStyle,
                }: ButtonProps) => {
    return (
        <RNButton
            mode={mode}
            onPress={onPress}
            disabled={disabled}
            loading={loading}
            icon={icon}
            style={style}
            contentStyle={contentStyle}
        >
            {children}
        </RNButton>
    );
};

Button.defaultProps = {
    mode: 'contained',
    disabled: false,
    loading: false,
    icon: undefined,
    style: {},
    contentStyle: {},
};

export default Button;
