export interface PokemonListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: PokemonBasic[];
}

export interface PokemonBasic {
    name: string;
    url: string;
}

export interface PokemonDetails {
    id: number;
    name: string;
    sprites: {
        front_default: string;
    };
    types: {
        type: {
            name: string;
        };
    }[];
}