export interface Field {
  bomb: boolean;
  flag: boolean;
  click: boolean;
  neighbours: number;
  image: string;
  x: number;
  y: number;
}

export interface Game {
  fields: Field[][];
}
