import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import useSWR from 'swr';
import { PokemonListResponse } from '../types/pokemon';
import { getPokemonList } from '../services/pokemonService';

const getPokemonIdFromUrl = (url: string) => {
    const matches = url.match(/\/pokemon\/(\d+)/);
    return matches ? parseInt(matches[1]) : 1;
};

export default function PokedexScreen() {
    const { data, error } = useSWR<PokemonListResponse>(
        'pokemon-list',
        () => getPokemonList(9)
    );

    if (error) return <Text>Failed to load</Text>;
    if (!data) return <Text>Loading...</Text>;

    return (
        <View style={styles.container}>
            {data.results.map((pokemon) => {
                const PokemonId = getPokemonIdFromUrl(pokemon.url);
                const ImageUrl = `https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${PokemonId}.svg`;

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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        padding: 16,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
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