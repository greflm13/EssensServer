export interface Game {
  fields: Field[][];
  lose: boolean;
  win: boolean;
  score: number;
  running: boolean;
  time: number;
}

export interface Field {
  number: number;
  color: string;
  merged: boolean;
}

export interface G2048 {
  people: People[];
}

export interface People {
  name: string;
  score: number;
  time: number;
}
