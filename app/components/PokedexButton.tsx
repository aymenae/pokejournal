import { Pressable, StyleSheet, Image, View } from 'react-native';

type Props = {
    onPress: () => void;
}

export default function PokedexButton({ onPress }: Props) {
    const ArrowR = 'https://img.icons8.com/?size=100&id=61&format=png&color=b4b9c0';
    const ArrowL = 'https://img.icons8.com/?size=100&id=1806&format=png&color=b4b9c0';
    
    return (
        <>
            <View style={styles.buttonsContainer}>
                <Pressable style={styles.button} onPress={onPress}>
                    <Image source={{ uri: ArrowL }} style={styles.image} />
                </Pressable>
                <Pressable style={styles.button} onPress={onPress}>
                    <Image source={{ uri: ArrowR }} style={styles.image} />
                </Pressable>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#45494f',
        borderRadius: 20,
        paddingTop: 10,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,
        margin: 15,
    },
    buttonsContainer: {
        flexDirection: 'row',
        backgroundColor: '#25292e',
        justifyContent: 'center',
    },
    image: {
        width: 50,
        height: 50,
    },
});