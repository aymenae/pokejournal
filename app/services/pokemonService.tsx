import { PokemonListResponse, PokemonDetails } from "../types/pokemon";

const BASE_URL = 'https://pokeapi.co/api/v2';

export const getPokemonList = async (limit = 1, offset = 0): Promise<PokemonListResponse> => {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`, {
        headers: {
            'Cache-Control': 'no-cache'
        }
    });
    if (!response.ok) {throw new Error('Failed to fetch');}
    return response.json();
};

export const getPokemonDetails = async (nameOrId: string | number): Promise<PokemonDetails> => {
    const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`, {
        headers: {
            'Cache-Control': 'no-cache'
        }
    });
    if (!response.ok) {throw new Error('Failed to fetch');}
    return response.json();
};

const pokemonService = {
    getPokemonList,
    getPokemonDetails
};

export default pokemonService;