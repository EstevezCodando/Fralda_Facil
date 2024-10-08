import { Text } from 'react-native';
import { Appbar } from 'react-native-paper';
import { router } from 'expo-router';

export default function DashBoardScreen() {
    return (
        <Appbar.Header>
            <Appbar.Content title="Relatório" />
            <Appbar.Action
                icon="dots-vertical"
                onPress={() => {
                    router.push('/settings');
                }}
            />
        </Appbar.Header>
    );
}
