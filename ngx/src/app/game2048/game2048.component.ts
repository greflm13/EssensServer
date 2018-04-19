import { Component, OnInit, HostListener } from '@angular/core';
import { Game } from './game';

@Component({
  selector: 'app-game2048',
  templateUrl: './game2048.component.html',
  styleUrls: ['./game2048.component.css']
})
export class Game2048Component implements OnInit {
  public game: Game = { fields: [], lose: false, score: 0, win: false };

  constructor() {}

  ngOnInit() {
    for (let i = 0; i < 4; i++) {
      this.game.fields.push([]);
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        this.game.fields[i].push({ number: 0, color: 'n0' });
      }
    }

    const sx = this.random(0, 3);
    const sy = this.random(0, 3);
    this.game.fields[sx][sy].number = 2;
    this.game.fields[sx][sy].color = 'n2';
  }

  @HostListener('window:keyup', ['$event'])
  async keyup(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      console.log('Up');
    }
    if (event.key === 'ArrowDown') {
      console.log('Down');
    }
    if (event.key === 'ArrowLeft') {
      for (let i = 0; i < 4; i++) {
        for (let j = 1; j < 4; j++) {
          if (this.game.fields[i][j - 1].number === 0 && !this.game.lose) {
            this.game.fields[i][j - 1].number = this.game.fields[i][j].number;
            this.game.fields[i][j - 1].color = 'n' + this.game.fields[i][j].number;
            this.game.fields[i][j].number = 0;
            this.game.fields[i][j].color = 'n0';
            if (!(j - 2 === -1)) {
              if (this.game.fields[i][j - 2].number === 0) {
                this.game.fields[i][j - 2].number = this.game.fields[i][j - 1].number;
                this.game.fields[i][j - 1].number = 0;
                this.game.fields[i][j - 1].color = 'n0';
                if (!(j - 3 === -1)) {
                  if (this.game.fields[i][j - 3].number === 0) {
                    this.game.fields[i][j - 3].number = this.game.fields[i][j - 2].number;
                    this.game.fields[i][j - 2].number = 0;
                    this.game.fields[i][j - 2].color = 'n0';
                  }
                }
              }
            }
          } else if (this.game.fields[i][j].number === this.game.fields[i][j - 1].number && !this.game.lose) {
            this.game.fields[i][j - 1].number = this.game.fields[i][j - 1].number + this.game.fields[i][j].number;
            this.game.fields[i][j].number = 0;
            this.game.fields[i][j].color = 'n0';
          }
        }
      }
    }
    if (event.key === 'ArrowRight') {
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
          console.log(i + ' ' + j);
          if (this.game.fields[i][j + 1].number === 0 && !this.game.lose) {
            this.game.fields[i][j + 1].number = this.game.fields[i][j].number;
            this.game.fields[i][j].number = 0;
            if (j + 2 < 3) {
              if (this.game.fields[i][j + 2].number === 0) {
                this.game.fields[i][j + 2].number = this.game.fields[i][j + 1].number;
                this.game.fields[i][j + 1].number = 0;
                if (j + 3 < 3) {
                  if (this.game.fields[i][j + 3].number === 0) {
                    this.game.fields[i][j + 3].number = this.game.fields[i][j + 2].number;
                    this.game.fields[i][j + 2].number = 0;
                  }
                }
              }
            }
          } else if (j < 3 && this.game.fields[i][j].number === this.game.fields[i][j + 1].number && !this.game.lose) {
            this.game.fields[i][j + 1].number = this.game.fields[i][j + 1].number + this.game.fields[i][j].number;
            this.game.fields[i][j].number = 0;
          }
        }
      }
    }
    let sx, sy;
    do {
      sx = this.random(0, 3);
      sy = this.random(0, 3);
    } while (this.game.fields[sx][sy].number !== 0);
    const e = this.random(0, 1);
    switch (e) {
      case 0:
        this.game.fields[sx][sy].number = 2;
        this.game.fields[sx][sy].color = 'n2';
        break;
      case 1:
        this.game.fields[sx][sy].number = 4;
        this.game.fields[sx][sy].color = 'n4';
        break;
    }
    let n = 0;
    await this.game.fields.forEach(fields => {
      fields.forEach(field => {
        if (field.number === 0) {
          n++;
        }
      });
    });
    if (n === 0) {
      this.game.lose = true;
      alert('you lose');
    }
  }

  random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
