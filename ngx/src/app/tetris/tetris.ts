export interface Game {
  fields: Field[][];
  future: Field[][];
}

export interface Field {
  color: string;
  active: boolean;
}
