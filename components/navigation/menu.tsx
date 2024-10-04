import React from 'react';
import { useCallback } from 'react';
import { Surface, Menu as Mn } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FC } from "react";

type MenuItem = {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
};

type MenuProps = {
    visible: boolean;
    items: MenuItem[];
    setVisible: (visible: boolean) => void;
};

const Menu: FC<MenuProps> = ({ visible, items, setVisible }) => {
    // Função memorável, que só será recriada se `setVisible` mudar
    const handlePress = useCallback((onPress: () => void) => {
        onPress();
        setVisible(false);
    }, [setVisible]);

    return visible ? (
        <Surface
            style={{
                flex: 1,
                position: "absolute",
                right: 20,
                top: 80,
                backgroundColor: "white",
                zIndex: 10000,
            }}
            elevation={2}
        >
            {items.map((item, index) => (
                <Mn.Item
                    key={index}
                    leadingIcon={() => <Ionicons name={item.icon} size={24} />}
                    title={item.title}
                    onPress={() => handlePress(item.onPress)}
                />
            ))}
        </Surface>
    ) : null;
};

export default React.memo(Menu);
