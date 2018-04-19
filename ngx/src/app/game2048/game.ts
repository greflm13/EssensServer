export interface Game {
  fields: Field[][];
  lose: boolean;
  win: boolean;
  score: number;
}

export interface Field {
  number: number;
  color: string;
}
