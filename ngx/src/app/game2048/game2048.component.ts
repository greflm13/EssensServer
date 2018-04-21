import { Component, OnInit, HostListener } from '@angular/core';
import { Game } from './game';

@Component({
  selector: 'app-game2048',
  templateUrl: './game2048.component.html',
  styleUrls: ['./game2048.component.css']
})
export class Game2048Component implements OnInit {
  public game: Game = { fields: [], lose: false, score: 0, win: false, running: false };
  private last: Touch;
  private mvcnt = 0;

  @HostListener('touchend', ['$event'])
  ontouchend(event: TouchEvent) {
    this.game.fields.forEach(fields => {
      fields.forEach(field => {
        field.color = '';
      });
    });
    this.mvcnt = 0;
    event.preventDefault();
    if (
      event.changedTouches[0].pageX - this.last.pageX > 80 &&
      this.game.running &&
      event.changedTouches[0].pageX - this.last.pageX > event.changedTouches[0].pageY - this.last.pageY
    ) {
      this.right();
      return;
    }

    if (
      event.changedTouches[0].pageX - this.last.pageX < -80 &&
      this.game.running &&
      event.changedTouches[0].pageX - this.last.pageX < event.changedTouches[0].pageY - this.last.pageY
    ) {
      this.left();
      return;
    }

    if (
      event.changedTouches[0].pageY - this.last.pageY > 80 &&
      this.game.running &&
      event.changedTouches[0].pageY - this.last.pageY > event.changedTouches[0].pageX - this.last.pageX
    ) {
      this.down();
      return;
    }

    if (
      event.changedTouches[0].pageY - this.last.pageY < -80 &&
      this.game.running &&
      event.changedTouches[0].pageY - this.last.pageY < event.changedTouches[0].pageX - this.last.pageX
    ) {
      this.up();
      return;
    }

    this.afterMove();
  }

  @HostListener('touchstart', ['$event'])
  ontouchstart(event: TouchEvent) {
    this.last = event.changedTouches[0];
    event.preventDefault();
  }

  constructor() {}

  async ngOnInit() {
    this.game.fields = [];
    this.game.running = false;
    this.game.win = false;
    this.game.lose = false;
    this.game.score = 0;

    for (let i = 0; i < 4; i++) {
      this.game.fields.push([]);
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        await this.game.fields[i].push({ number: 0, color: 'n0' });
      }
    }

    const sx = this.random(0, 3);
    const sy = this.random(0, 3);
    this.game.fields[sx][sy].number = 2;
    this.game.fields[sx][sy].color = 'pop';
    this.game.running = true;
    this.setColor();
  }

  @HostListener('window:keyup', ['$event'])
  async keyup(event: KeyboardEvent) {
    this.game.fields.forEach(fields => {
      fields.forEach(field => {
        field.color = '';
      });
    });
    this.mvcnt = 0;
    if (event.key === 'ArrowUp' && !this.game.lose) {
      this.up();
    }

    if (event.key === 'ArrowDown' && !this.game.lose) {
      this.down();
    }

    if (event.key === 'ArrowLeft' && !this.game.lose) {
      this.left();
    }

    if (event.key === 'ArrowRight' && !this.game.lose) {
      this.right();
    }
    this.afterMove();
  }

  async afterMove() {
    if (!this.game.lose && this.mvcnt > 0) {
      let sx, sy;
      do {
        sx = this.random(0, 3);
        sy = this.random(0, 3);
      } while (this.game.fields[sx][sy].number !== 0);
      const e = this.random(0, 9);
      switch (e) {
        case 0:
          this.game.fields[sx][sy].number = 2;
          this.game.fields[sx][sy].color = 'pop';
          break;
        case 1:
          this.game.fields[sx][sy].number = 4;
          this.game.fields[sx][sy].color = 'pop';
          break;
        case 2:
          this.game.fields[sx][sy].number = 2;
          this.game.fields[sx][sy].color = 'pop';
          break;
        case 3:
          this.game.fields[sx][sy].number = 2;
          this.game.fields[sx][sy].color = 'pop';
          break;
        case 4:
          this.game.fields[sx][sy].number = 2;
          this.game.fields[sx][sy].color = 'pop';
          break;
        case 5:
          this.game.fields[sx][sy].number = 2;
          this.game.fields[sx][sy].color = 'pop';
          break;
        case 6:
          this.game.fields[sx][sy].number = 2;
          this.game.fields[sx][sy].color = 'pop';
          break;
        case 7:
          this.game.fields[sx][sy].number = 2;
          this.game.fields[sx][sy].color = 'pop';
          break;
        case 8:
          this.game.fields[sx][sy].number = 2;
          this.game.fields[sx][sy].color = 'pop';
          break;
        case 9:
          this.game.fields[sx][sy].number = 2;
          this.game.fields[sx][sy].color = 'pop';
          break;
      }
    }
    this.setColor();

    let los = 0;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (i > 0 && this.game.fields[i][j].number === this.game.fields[i - 1][j].number) {
          los++;
        }
        if (j > 0 && this.game.fields[i][j].number === this.game.fields[i][j - 1].number) {
          los++;
        }
        if (i < 3 && this.game.fields[i][j].number === this.game.fields[i + 1][j].number) {
          los++;
        }
        if (j < 3 && this.game.fields[i][j].number === this.game.fields[i][j + 1].number) {
          los++;
        }
        if (this.game.fields[i][j].number === 0) {
          los++;
        }
      }
    }
    if (los === 0) {
      this.game.lose = true;
    }
  }

  left() {
    for (let i = 0; i < 4; i++) {
      if (this.game.fields[i][0].number === this.game.fields[i][1].number && !(this.game.fields[i][0].number === 0)) {
        this.game.fields[i][0].number += this.game.fields[i][1].number;
        this.game.score += this.game.fields[i][0].number;
        this.game.fields[i][1].number = 0;
        this.mvcnt++;
      } else if (this.game.fields[i][0].number === 0 && !(this.game.fields[i][1].number === 0)) {
        this.game.fields[i][0].number = this.game.fields[i][1].number;
        this.game.fields[i][1].number = 0;
        this.mvcnt++;
      }

      if (this.game.fields[i][1].number === this.game.fields[i][2].number && !(this.game.fields[i][1].number === 0)) {
        this.game.fields[i][1].number += this.game.fields[i][2].number;
        this.game.score += this.game.fields[i][1].number;
        this.game.fields[i][2].number = 0;
        this.mvcnt++;
      } else if (
        this.game.fields[i][0].number === this.game.fields[i][2].number &&
        this.game.fields[i][1].number === 0 &&
        !(this.game.fields[i][0].number === 0)
      ) {
        this.game.fields[i][0].number += this.game.fields[i][2].number;
        this.game.score += this.game.fields[i][0].number;
        this.game.fields[i][2].number = 0;
        this.mvcnt++;
      } else if (this.game.fields[i][0].number === 0 && !(this.game.fields[i][2].number === 0)) {
        this.game.fields[i][0].number = this.game.fields[i][2].number;
        this.game.fields[i][2].number = 0;
        this.mvcnt++;
      } else if (this.game.fields[i][1].number === 0 && !(this.game.fields[i][2].number === 0)) {
        this.game.fields[i][1].number = this.game.fields[i][2].number;
        this.game.fields[i][2].number = 0;
        this.mvcnt++;
      }

      if (this.game.fields[i][2].number === this.game.fields[i][3].number && !(this.game.fields[i][2].number === 0)) {
        this.game.fields[i][2].number += this.game.fields[i][3].number;
        this.game.score += this.game.fields[i][2].number;
        this.game.fields[i][3].number = 0;
        this.mvcnt++;
      } else if (
        this.game.fields[i][1].number === this.game.fields[i][3].number &&
        this.game.fields[i][2].number === 0 &&
        !(this.game.fields[i][3].number === 0)
      ) {
        this.game.fields[i][1].number += this.game.fields[i][3].number;
        this.game.score += this.game.fields[i][1].number;
        this.game.fields[i][3].number = 0;
        this.mvcnt++;
      } else if (
        this.game.fields[i][0].number === this.game.fields[i][3].number &&
        this.game.fields[i][1].number === 0 &&
        !(this.game.fields[i][3].number === 0)
      ) {
        this.game.fields[i][0].number += this.game.fields[i][3].number;
        this.game.score += this.game.fields[i][0].number;
        this.game.fields[i][3].number = 0;
        this.mvcnt++;
      } else if (this.game.fields[i][0].number === 0 && !(this.game.fields[i][3].number === 0)) {
        this.game.fields[i][0].number = this.game.fields[i][3].number;
        this.game.fields[i][3].number = 0;
        this.mvcnt++;
      } else if (this.game.fields[i][1].number === 0 && !(this.game.fields[i][3].number === 0)) {
        this.game.fields[i][1].number = this.game.fields[i][3].number;
        this.game.fields[i][3].number = 0;
        this.mvcnt++;
      } else if (this.game.fields[i][2].number === 0 && !(this.game.fields[i][3].number === 0)) {
        this.game.fields[i][2].number = this.game.fields[i][3].number;
        this.game.fields[i][3].number = 0;
        this.mvcnt++;
      }
    }
  }

  right() {
    for (let i = 0; i < 4; i++) {
      if (this.game.fields[i][3].number === this.game.fields[i][2].number && !(this.game.fields[i][2].number === 0)) {
        this.game.fields[i][3].number += this.game.fields[i][2].number;
        this.game.score += this.game.fields[i][3].number;
        this.game.fields[i][2].number = 0;
        this.mvcnt++;
      } else if (this.game.fields[i][3].number === 0 && !(this.game.fields[i][2].number === 0)) {
        this.game.fields[i][3].number = this.game.fields[i][2].number;
        this.game.fields[i][2].number = 0;
        this.mvcnt++;
      }

      if (this.game.fields[i][2].number === this.game.fields[i][1].number && !(this.game.fields[i][1].number === 0)) {
        this.game.fields[i][2].number += this.game.fields[i][1].number;
        this.game.score += this.game.fields[i][2].number;
        this.game.fields[i][1].number = 0;
        this.mvcnt++;
      } else if (
        this.game.fields[i][3].number === this.game.fields[i][1].number &&
        this.game.fields[i][2].number === 0 &&
        !(this.game.fields[i][1].number === 0)
      ) {
        this.game.fields[i][3].number += this.game.fields[i][1].number;
        this.game.score += this.game.fields[i][3].number;
        this.game.fields[i][1].number = 0;
        this.mvcnt++;
      } else if (this.game.fields[i][3].number === 0 && !(this.game.fields[i][1].number === 0)) {
        this.game.fields[i][3].number = this.game.fields[i][1].number;
        this.game.fields[i][1].number = 0;
        this.mvcnt++;
      } else if (this.game.fields[i][2].number === 0 && !(this.game.fields[i][1].number === 0)) {
        this.game.fields[i][2].number = this.game.fields[i][1].number;
        this.game.fields[i][1].number = 0;
        this.mvcnt++;
      }

      if (this.game.fields[i][1].number === this.game.fields[i][0].number && !(this.game.fields[i][0].number === 0)) {
        this.game.fields[i][1].number += this.game.fields[i][0].number;
        this.game.score += this.game.fields[i][1].number;
        this.game.fields[i][0].number = 0;
        this.mvcnt++;
      } else if (
        this.game.fields[i][2].number === this.game.fields[i][0].number &&
        this.game.fields[i][1].number === 0 &&
        !(this.game.fields[i][0].number === 0)
      ) {
        this.game.fields[i][2].number += this.game.fields[i][0].number;
        this.game.score += this.game.fields[i][2].number;
        this.game.fields[i][0].number = 0;
        this.mvcnt++;
      } else if (
        this.game.fields[i][3].number === this.game.fields[i][0].number &&
        this.game.fields[i][2].number === 0 &&
        !(this.game.fields[i][0].number === 0)
      ) {
        this.game.fields[i][3].number += this.game.fields[i][0].number;
        this.game.score += this.game.fields[i][3].number;
        this.game.fields[i][0].number = 0;
        this.mvcnt++;
      } else if (this.game.fields[i][3].number === 0 && !(this.game.fields[i][0].number === 0)) {
        this.game.fields[i][3].number = this.game.fields[i][0].number;
        this.game.fields[i][0].number = 0;
        this.mvcnt++;
      } else if (this.game.fields[i][2].number === 0 && !(this.game.fields[i][0].number === 0)) {
        this.game.fields[i][2].number = this.game.fields[i][0].number;
        this.game.fields[i][0].number = 0;
        this.mvcnt++;
      } else if (this.game.fields[i][1].number === 0 && !(this.game.fields[i][0].number === 0)) {
        this.game.fields[i][1].number = this.game.fields[i][0].number;
        this.game.fields[i][0].number = 0;
        this.mvcnt++;
      }
    }
  }

  up() {
    for (let i = 0; i < 4; i++) {
      if (this.game.fields[0][i].number === this.game.fields[1][i].number && !(this.game.fields[1][i].number === 0)) {
        this.game.fields[0][i].number += this.game.fields[1][i].number;
        this.game.score += this.game.fields[0][i].number;
        this.game.fields[1][i].number = 0;
        this.mvcnt++;
      } else if (this.game.fields[0][i].number === 0 && !(this.game.fields[1][i].number === 0)) {
        this.game.fields[0][i].number = this.game.fields[1][i].number;
        this.game.fields[1][i].number = 0;
        this.mvcnt++;
      }

      if (this.game.fields[1][i].number === this.game.fields[2][i].number && !(this.game.fields[2][i].number === 0)) {
        this.game.fields[1][i].number += this.game.fields[2][i].number;
        this.game.score += this.game.fields[1][i].number;
        this.game.fields[2][i].number = 0;
        this.mvcnt++;
      } else if (
        this.game.fields[0][i].number === this.game.fields[2][i].number &&
        this.game.fields[1][i].number === 0 &&
        !(this.game.fields[2][i].number === 0)
      ) {
        this.game.fields[0][i].number += this.game.fields[2][i].number;
        this.game.score += this.game.fields[0][i].number;
        this.game.fields[2][i].number = 0;
        this.mvcnt++;
      } else if (this.game.fields[0][i].number === 0 && !(this.game.fields[2][i].number === 0)) {
        this.game.fields[0][i].number = this.game.fields[2][i].number;
        this.game.fields[2][i].number = 0;
        this.mvcnt++;
      } else if (this.game.fields[1][i].number === 0 && !(this.game.fields[2][i].number === 0)) {
        this.game.fields[1][i].number = this.game.fields[2][i].number;
        this.game.fields[2][i].number = 0;
        this.mvcnt++;
      }

      if (this.game.fields[2][i].number === this.game.fields[3][i].number && !(this.game.fields[3][i].number === 0)) {
        this.game.fields[2][i].number += this.game.fields[3][i].number;
        this.game.score += this.game.fields[2][i].number;
        this.game.fields[3][i].number = 0;
        this.mvcnt++;
      } else if (
        this.game.fields[1][i].number === this.game.fields[3][i].number &&
        this.game.fields[2][i].number === 0 &&
        !(this.game.fields[3][i].number === 0)
      ) {
        this.game.fields[1][i].number += this.game.fields[3][i].number;
        this.game.score += this.game.fields[1][i].number;
        this.game.fields[3][i].number = 0;
        this.mvcnt++;
      } else if (
        this.game.fields[0][i].number === this.game.fields[3][i].number &&
        this.game.fields[1][i].number === 0 &&
        !(this.game.fields[3][i].number === 0)
      ) {
        this.game.fields[0][i].number += this.game.fields[3][i].number;
        this.game.score += this.game.fields[0][i].number;
        this.game.fields[3][i].number = 0;
        this.mvcnt++;
      } else if (this.game.fields[0][i].number === 0 && !(this.game.fields[3][i].number === 0)) {
        this.game.fields[0][i].number = this.game.fields[3][i].number;
        this.game.fields[3][i].number = 0;
        this.mvcnt++;
      } else if (this.game.fields[1][i].number === 0 && !(this.game.fields[3][i].number === 0)) {
        this.game.fields[1][i].number = this.game.fields[3][i].number;
        this.game.fields[3][i].number = 0;
        this.mvcnt++;
      } else if (this.game.fields[2][i].number === 0 && !(this.game.fields[3][i].number === 0)) {
        this.game.fields[2][i].number = this.game.fields[3][i].number;
        this.game.fields[3][i].number = 0;
        this.mvcnt++;
      }
    }
  }

  down() {
    for (let i = 0; i < 4; i++) {
      if (this.game.fields[3][i].number === this.game.fields[2][i].number && !(this.game.fields[2][i].number === 0)) {
        this.game.fields[3][i].number += this.game.fields[2][i].number;
        this.game.score += this.game.fields[3][i].number;
        this.game.fields[2][i].number = 0;
        this.mvcnt++;
      } else if (this.game.fields[3][i].number === 0 && !(this.game.fields[2][i].number === 0)) {
        this.game.fields[3][i].number = this.game.fields[2][i].number;
        this.game.fields[2][i].number = 0;
        this.mvcnt++;
      }

      if (this.game.fields[2][i].number === this.game.fields[1][i].number && !(this.game.fields[1][i].number === 0)) {
        this.game.fields[2][i].number += this.game.fields[1][i].number;
        this.game.score += this.game.fields[2][i].number;
        this.game.fields[1][i].number = 0;
        this.mvcnt++;
      } else if (
        this.game.fields[3][i].number === this.game.fields[1][i].number &&
        this.game.fields[2][i].number === 0 &&
        !(this.game.fields[1][i].number === 0)
      ) {
        this.game.fields[3][i].number += this.game.fields[1][i].number;
        this.game.score += this.game.fields[3][i].number;
        this.game.fields[1][i].number = 0;
        this.mvcnt++;
      } else if (this.game.fields[3][i].number === 0 && !(this.game.fields[1][i].number === 0)) {
        this.game.fields[3][i].number = this.game.fields[1][i].number;
        this.game.fields[1][i].number = 0;
        this.mvcnt++;
      } else if (this.game.fields[2][i].number === 0 && !(this.game.fields[1][i].number === 0)) {
        this.game.fields[2][i].number = this.game.fields[1][i].number;
        this.game.fields[1][i].number = 0;
        this.mvcnt++;
      }

      if (this.game.fields[1][i].number === this.game.fields[0][i].number && !(this.game.fields[0][i].number === 0)) {
        this.game.fields[1][i].number += this.game.fields[0][i].number;
        this.game.score += this.game.fields[1][i].number;
        this.game.fields[0][i].number = 0;
        this.mvcnt++;
      } else if (
        this.game.fields[2][i].number === this.game.fields[0][i].number &&
        this.game.fields[1][i].number === 0 &&
        !(this.game.fields[0][i].number === 0)
      ) {
        this.game.fields[2][i].number += this.game.fields[0][i].number;
        this.game.score += this.game.fields[2][i].number;
        this.game.fields[0][i].number = 0;
        this.mvcnt++;
      } else if (
        this.game.fields[3][i].number === this.game.fields[0][i].number &&
        this.game.fields[2][i].number === 0 &&
        !(this.game.fields[0][i].number === 0)
      ) {
        this.game.fields[3][i].number += this.game.fields[0][i].number;
        this.game.score += this.game.fields[3][i].number;
        this.game.fields[0][i].number = 0;
        this.mvcnt++;
      } else if (this.game.fields[3][i].number === 0 && !(this.game.fields[0][i].number === 0)) {
        this.game.fields[3][i].number = this.game.fields[0][i].number;
        this.game.fields[0][i].number = 0;
        this.mvcnt++;
      } else if (this.game.fields[2][i].number === 0 && !(this.game.fields[0][i].number === 0)) {
        this.game.fields[2][i].number = this.game.fields[0][i].number;
        this.game.fields[0][i].number = 0;
        this.mvcnt++;
      } else if (this.game.fields[1][i].number === 0 && !(this.game.fields[0][i].number === 0)) {
        this.game.fields[1][i].number = this.game.fields[0][i].number;
        this.game.fields[0][i].number = 0;
        this.mvcnt++;
      }
    }
  }

  setColor() {
    this.game.fields.forEach(fields => {
      fields.forEach(field => {
        field.color += ' n' + field.number;
      });
    });
  }

  random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
