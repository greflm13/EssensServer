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
  win: boolean;
  lose: boolean;
  running: boolean;
  bombs: number;
  flags: number;
  sizeX: number;
  sizeY: number;
  time: number;
}

export interface Neighbour {
  x: number;
  y: number;
}

export interface Leaderboard {
  people: People[];
}

export interface People {
  name: string;
  x: number;
  y: number;
  field_size: string;
  bomb_count: number;
  time: number;
}
