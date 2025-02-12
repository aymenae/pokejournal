import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import useSWR from 'swr';
import { PokemonListResponse } from '../types/pokemon';
import { getPokemonList } from '../services/pokemonService';

export default function PokedexPage() {
    const { data, error } = useSWR<PokemonListResponse>(
        'pokemon-list', 
        () => getPokemonList(5)
    );

    if (error) return <Text>Failed to load</Text>;
    if (!data) return <Text>Loading...</Text>;

    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                {JSON.stringify(data, null, 2)}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 16,
        fontFamily: 'monospace',
        color: '#fff',
    },
});