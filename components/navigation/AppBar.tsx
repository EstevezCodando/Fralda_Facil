import { Appbar, useTheme } from "react-native-paper";
import React from 'react';
import { router } from "expo-router";
import { FC } from "react";

type AppBarProps = {
    title: string;
    back?: boolean;
    icon?: string;
    onPress?: () => void;
};

const AppBar: FC<AppBarProps> = ({ title, back = false, icon, onPress }) => {
    const theme = useTheme();

    return (
        <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
            {back && <Appbar.BackAction onPress={() => router.back()} />}
            <Appbar.Content title={title} />
            {icon && <Appbar.Action icon={icon} onPress={onPress} />}
        </Appbar.Header>
    );
};

export default React.memo(AppBar);
