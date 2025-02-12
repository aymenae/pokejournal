import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import useSWR from 'swr';
import { PokemonListResponse } from '../types/pokemon';
import { getPokemonList } from '../services/pokemonService';

export default function PokedexScreen() {
    const { data, error } = useSWR<PokemonListResponse>(
        'pokemon-list', 
        () => getPokemonList(5)
    );

    if (error) return <Text>Failed to load</Text>;
    if (!data) return <Text>Loading...</Text>;

    return (
        <View style={styles.container}>
            {data.results.map((pokemon) => (
                <Text key={pokemon.name} style={styles.text}>
                    {pokemon.name}
                </Text>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        justifyContent: 'center',
        alignItems: 'center',
      },
      text: {
        fontSize: 16,
        fontFamily: 'monospace',
        color: '#fff',
    },
});