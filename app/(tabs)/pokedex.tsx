import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, ScrollView } from 'react-native';
import useSWRInfinite from 'swr/infinite';
import { PokemonListResponse, PokemonDetail } from '../types/pokemon';
import PokedexButton from '../components/PokedexButton';

const getPokemonIdFromUrl = (url: string) => {
    const matches = url.match(/\/pokemon\/(\d+)/);
    return matches ? parseInt(matches[1]) : 1;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const PAGE_SIZE = 6;

const getKey = (pageIndex: number, previousPageData: PokemonListResponse) => {
    if (previousPageData && !previousPageData.next) return null; // reached the end
    return `https://pokeapi.co/api/v2/pokemon?limit=${PAGE_SIZE}&offset=${pageIndex * PAGE_SIZE}`;
};

export default function PokedexScreen() {
    const { data, error, size, setSize } = useSWRInfinite(getKey, fetcher);
    const [detailedPokemon, setDetailedPokemon] = useState<PokemonDetail[]>([]);

    useEffect(() => {
        if (data && data[size - 1]) {
            const fetchDetails = async () => {
                const details = await Promise.all(
                    data[size - 1].results.map((pokemon) =>
                        fetch(pokemon.url).then((res) => res.json())
                    )
                );
                setDetailedPokemon(details);
            };
            fetchDetails();
        }
    }, [data, size]);

    if (error) return <Text>Failed to load</Text>;
    if (!data) return <Text>Loading...</Text>;

    return (
        <>
        <ScrollView contentContainerStyle={styles.container}>
            {detailedPokemon.map((pokemon) => {
                const ImageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

                return (
                    <View key={pokemon.id} style={styles.pokemonCard}>
                        <Image
                            source={{ uri: ImageUrl }}
                            style={styles.pokemonImage}
                            resizeMode='contain' 
                        />
                        <Text style={styles.text}>
                            {pokemon.name}
                        </Text>
                        <Text style={styles.text}>
                            Type: {pokemon.types.map(typeInfo => typeInfo.type.name).join(', ')}
                        </Text>
                        <Text style={styles.text}>
                            Abilities: {pokemon.abilities.map(abilityInfo => abilityInfo.ability.name).join(', ')}
                        </Text>
                    </View>
                );
            })}
        </ScrollView>
        <View style={styles.buttonContainer}>
            <PokedexButton direction="left" onPress={() => setSize(size > 1 ? size - 1 : size)} disabled={size <= 1} />
            <PokedexButton direction="right" onPress={() => setSize(size + 1)} />
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
    titletext: {
        fontSize: 24,
        fontFamily: 'monospace',
        color: '#fff',
        marginTop: 8,
        textTransform: 'capitalize',
        textAlign: 'center',
    },
    text: {
        fontSize: 16,
        fontFamily: 'monospace',
        color: '#fff',
        marginTop: 8,
        textTransform: 'capitalize',
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 16,
        backgroundColor: '#25292e',
    },
});