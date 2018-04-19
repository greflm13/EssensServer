export interface Game {
  fields: Field[][];
  lose: boolean;
  win: boolean;
  score: number;
  image: string;
}

export interface Field {
  number: number;
}
