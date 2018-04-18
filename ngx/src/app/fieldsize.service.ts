import { Injectable } from '@angular/core';
import { GameSize } from './minesweeper/field';

@Injectable()
export class FieldsizeService {
  private _size: GameSize;

  constructor() {}

  public set Size(size: GameSize) {
    this._size = size;
  }

  public get Size() {
    return this._size;
  }
}
