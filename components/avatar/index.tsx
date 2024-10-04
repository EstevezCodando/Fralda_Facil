import * as React from 'react';
import { Avatar as Av } from 'react-native-paper';

interface AvatarProps {
    source?: any;
    icon?: string;
    label?: string;
    bgColor?: string;
    color?: string;
    style?: object;
    size?: number;
}

const Avatar = (props: AvatarProps) => {
    const renderAvatar = () => {
        if (props.source) {
            return (
                <Av.Image
                    style={{ ...props.style, backgroundColor: props.bgColor }}
                    source={props.source}
                    size={props.size}
                />
            );
        } else if (props.icon) {
            return (
                <Av.Icon
                    style={{ ...props.style, backgroundColor: props.bgColor }}
                    icon={props.icon}
                    size={props.size}
                />
            );
        } else {
            return (
                <Av.Text
                    style={{ ...props.style, backgroundColor: props.bgColor }}
                    label={props.label || 'N/A'}
                    size={props.size}
                />
            );
        }
    };

    return renderAvatar();
};

Avatar.defaultProps = {
    source: null,
    label: 'XD',
    bgColor: '#fff',
    color: '#333',
    size: 64,
};

export default Avatar;
