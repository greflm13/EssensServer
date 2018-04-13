export interface Field {
    bomb: boolean;
    flag: boolean;
    click: boolean;
    neighbours: number;
    image: string;
}

export interface Game {
    fields: Field[];
}
