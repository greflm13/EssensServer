import { Component, OnInit } from '@angular/core';
import { Game } from './tetris';

@Component({
  selector: 'app-tetris',
  templateUrl: './tetris.component.html',
  styleUrls: ['./tetris.component.css']
})
export class TetrisComponent implements OnInit {
  public game: Game = { fields: [], future: [] };

  constructor() {}

  async ngOnInit() {
    for (let i = 0; i < 20; i++) {
      this.game.fields.push([]);
    }

    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 10; j++) {
        await this.game.fields[i].push({ color: '', active: false });
      }
    }

    for (let i = 0; i < 4; i++) {
      this.game.future.push([]);
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 10; j++) {
        await this.game.future[i].push({ color: '', active: false });
      }
    }
    // this.game.fields[19][1].color = 'b';
    this.game.future[3][1].color = 'b';
    this.game.future[3][1].active = true;
    this.game.future[3][2].color = 'b';
    this.game.future[3][2].active = true;
    this.game.future[2][1].color = 'b';
    this.game.future[2][1].active = true;
    this.game.future[2][2].color = 'b';
    this.game.future[2][2].active = true;
    this.gameTick();
  }

  gameTick() {
    setInterval(() => {
      let cnt = 0;
      for (let i = 19; i >= 0; i--) {
        for (let j = 9; j >= 0; j--) {
          if (i + 1 === 20 && this.game.fields[i][j].active) {
            this.game.fields[i][j].active = false;
            cnt++;
          } else if (this.game.fields[i][j].active && this.game.fields[i + 1][j].color === '') {
            this.game.fields[i + 1][j].color = this.game.fields[i][j].color;
            this.game.fields[i + 1][j].active = true;
            this.game.fields[i][j].color = '';
            this.game.fields[i][j].active = false;
          } else if (this.game.fields[i][j].active) {
            this.game.fields[i][j].active = false;
            cnt++;
          }
        }
      }
      for (let i = 3; i >= 0; i--) {
        for (let j = 9; j >= 0; j--) {
          if (i + 1 === 4) {
            this.game.fields[0][j] = this.game.future[i][j];
            this.game.future[i][j] = { active: false, color: '' };
          } else if (this.game.future[i][j].active && this.game.future[i + 1][j].color === '') {
            this.game.future[i + 1][j].color = this.game.future[i][j].color;
            this.game.future[i + 1][j].active = true;
            this.game.future[i][j].color = '';
            this.game.future[i][j].active = false;
          } else if (this.game.future[i][j].active) {
            this.game.future[i][j].active = false;
          }
        }
      }
      if (cnt > 0) {
        this.newTile();
        cnt = 0;
      }
    }, 250);
  }

  newTile() {
    console.log(this.random(1, 9));
  }

  random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
