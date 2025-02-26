import React from 'react';
import { Text, View, StyleSheet, Image, ScrollView } from 'react-native';
import useSWR from 'swr';
import { PokemonListResponse } from '../types/pokemon';
import { getPokemonList } from '../services/pokemonService';
import PokedexButton from '../components/PokedexButton';

const getPokemonIdFromUrl = (url: string) => {
    const matches = url.match(/\/pokemon\/(\d+)/);
    return matches ? parseInt(matches[1]) : 1;
};

const url = 'https://pokeapi.co/api/v2/pokemon/';

const fetcher = (...args: [string]) => fetch(...args).then((res) => res.json());

export default function PokedexScreen() {
    const { data: result, error } = useSWR(url, fetcher)

    if (error) return <Text>Failed to load</Text>;
    if (!result) return <Text>Loading...</Text>;

    return (
        <>
        <ScrollView contentContainerStyle={styles.container}>
            {result.results.map((pokemon) => {
                const PokemonId = getPokemonIdFromUrl(pokemon.url);
                const ImageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${PokemonId}.png`;

                return (
                    <View key={PokemonId} style={styles.pokemonCard}>
                        <Image
                            source={{ uri: ImageUrl }}
                            style={styles.pokemonImage}
                            resizeMode='contain' 
                        />
                        <Text style={styles.text}>
                            {pokemon.name}
                        </Text>
                    </View>
                );
            })}
        </ScrollView>
        <View>
            <PokedexButton onPress={() => console.log('PokedexButton pressed')} />
        </View> 
        </>

    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#25292e',
        paddingLeft: 16,
        paddingTop: 16,
        paddingRight: 16,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
    },
    pokemonCard: {
        width: '30%',
        alignItems: 'center',
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#2f3542',
        borderRadius: 8,
    },
    pokemonImage: {
        width: 120,
        height: 120,
    },
    text: {
        fontSize: 16,
        fontFamily: 'monospace',
        color: '#fff',
        marginTop: 8,
        textTransform: 'capitalize',
    },
});