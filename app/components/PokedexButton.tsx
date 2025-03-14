import React from 'react';
import { Pressable, StyleSheet, Image } from 'react-native';

type Props = {
    onPress: () => void;
    direction: 'left' | 'right';
    disabled?: boolean;
}

export default function PokedexButton({ onPress, direction, disabled }: Props) {
    const ArrowR = 'https://img.icons8.com/?size=100&id=61&format=png&color=b4b9c0';
    const ArrowL = 'https://img.icons8.com/?size=100&id=1806&format=png&color=b4b9c0';
    
    const isLeft = direction === 'left';
    const arrowUri = isLeft ? ArrowL : ArrowR;
    const buttonStyle = isLeft ? styles.buttonL : styles.buttonR;

    return (
        <Pressable style={buttonStyle} onPress={onPress} disabled={disabled}>
            <Image source={{ uri: arrowUri }} style={styles.image} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    buttonR: {
        backgroundColor: '#45494f',
        borderRadius: 20,
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 15,
        paddingBottom: 20,
        margin: 15,
    },
    buttonL: {
        backgroundColor: '#45494f',
        borderRadius: 20,
        paddingTop: 20,
        paddingLeft: 15,
        paddingRight: 20,
        paddingBottom: 20,
        margin: 15,
    },
    image: {
        width: 50,
        height: 50,
    },
});