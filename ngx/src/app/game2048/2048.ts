export interface Game {
  fields: Field[][];
  lose: boolean;
  win: boolean;
  score: number;
  running: boolean;
}

export interface Field {
  number: number;
  color: string;
  merged: boolean;
}
