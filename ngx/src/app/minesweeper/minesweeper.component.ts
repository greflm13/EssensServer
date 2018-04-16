import { Component, OnInit } from '@angular/core';
import { Field, Game } from './field';

@Component({
  selector: 'app-minesweeper',
  templateUrl: './minesweeper.component.html',
  styleUrls: ['./minesweeper.component.css']
})
export class MinesweeperComponent implements OnInit {
  public win: boolean;
  public lose: boolean;
  public flags: number;
  public game: Game;
  public time: number;
  private sizeX: number;
  private sizeY: number;
  private timeInt;

  constructor() {}

  ngOnInit() {
    this.win = false;
    this.lose = false;
    this.sizeX = undefined;
    this.sizeY = undefined;
    this.flags = undefined;
    this.time = 0;
    this.game = { fields: [] };

    do {
      const y = prompt('Größe des Feldes in X - Richtung:');
      if (!isNaN(parseInt(y, 10))) {
        if (parseInt(y, 10) > 1) {
          this.sizeY = parseInt(y, 10);
        }
      }
    } while (this.sizeY === undefined || this.sizeY === null || this.sizeY === 0);

    do {
      const x = prompt('Größe des Feldes in Y - Richtung:');
      if (!isNaN(parseInt(x, 10))) {
        if (parseInt(x, 10) > 1) {
          this.sizeX = parseInt(x, 10);
        }
      }
    } while (this.sizeX === undefined || this.sizeX === null || this.sizeX === 0);

    do {
      const bombs = prompt('Anzahl der Bomben (max ' + (this.sizeX * this.sizeY - 1) + '):');
      if (!isNaN(parseInt(bombs, 10))) {
        if (parseInt(bombs, 10) <= this.sizeX * this.sizeY - 1 && parseInt(bombs, 10) > 1) {
          this.flags = parseInt(bombs, 10);
        }
      }
    } while (this.flags === undefined || this.flags === null || this.flags === 0);

    for (let i = 0; i < this.sizeX; i++) {
      this.game.fields.push([]);
    }

    for (let i = 0; i < this.sizeX; i++) {
      for (let j = this.game.fields[i].length; j < this.sizeY; j++) {
        this.game.fields[i].push({ bomb: false, click: false, flag: false, image: 'default', neighbours: 0, x: i, y: j });
      }
    }

    for (let i = 0; i < this.flags; i++) {
      const x = this.random(0, this.sizeX - 1);
      const y = this.random(0, this.sizeY - 1);
      if (!this.game.fields[x][y].bomb) {
        this.game.fields[x][y].bomb = true;
      } else {
        i--;
      }
    }
    this.countBombs();
    this.timeInt = setInterval(() => {
      this.time++;
    }, 1000);
  }

  check(x: number, y: number) {
    if (!this.lose && !this.game.fields[x][y].flag) {
      if (this.game.fields[x][y].bomb) {
        this.lose = true;
        clearInterval(this.timeInt);
        for (let i = 0; i < this.game.fields.length; i++) {
          for (let j = 0; j < this.game.fields[i].length; j++) {
            if (this.game.fields[i][j].bomb && !this.game.fields[i][j].flag) {
              this.game.fields[i][j].image = 'bomb';
            }
          }
        }
        alert('You lose!');
      } else {
        this.setPicture(x, y);
      }
    }
  }

  checkDown(field: number) {}

  checkUp(field: number) {}

  // checkOneRight(field: number): boolean {}

  checkRightLeft(field: number) {}

  // checkOneLeft(field: number): boolean {}

  checkLeft(field: number) {}

  setPicture(x: number, y: number) {
    this.game.fields[x][y].click = true;
    switch (this.game.fields[x][y].neighbours) {
      case 1:
        this.game.fields[x][y].image = '1_bomb';
        break;
      case 2:
        this.game.fields[x][y].image = '2_bomb';
        break;
      case 3:
        this.game.fields[x][y].image = '3_bomb';
        break;
      case 4:
        this.game.fields[x][y].image = '4_bomb';
        break;
      case 5:
        this.game.fields[x][y].image = '5_bomb';
        break;
      case 6:
        this.game.fields[x][y].image = '6_bomb';
        break;
      case 7:
        this.game.fields[x][y].image = '7_bomb';
        break;
      case 8:
        this.game.fields[x][y].image = '8_bomb';
        break;
      default:
        this.game.fields[x][y].image = 'empty';
        break;
    }
  }

  onRightClick(event, x: number, y: number) {
    if (this.game.fields[x][y].flag) {
      this.game.fields[x][y].image = 'default';
      this.flags++;
    }
    if (this.flags > 0) {
      if (!this.lose && !this.game.fields[x][y].click) {
        this.game.fields[x][y].flag = !this.game.fields[x][y].flag;
        if (this.game.fields[x][y].flag) {
          this.game.fields[x][y].image = 'flag';
          this.flags--;
        }
      }
      // let bombswoutflag = 0;
      // for (const funf of this.game.fields) {
      //   if (funf.bomb && !funf.flag) {
      //     bombswoutflag++;
      //   }
      // }
      // if (bombswoutflag === 0) {
      //   this.win = true;
      //   clearInterval(this.timeInt);
      //   alert('You Win! Your Time: ' + this.time);
      // }
    } else {
      alert('Keine Flaggen mehr!');
    }
    return false;
  }

  countBombs() {
    for (let i = 0; i < this.game.fields.length; i++) {
      for (let j = 0; j < this.game.fields[i].length; j++) {
        let bombs = 0;
        if (i > 0) {
          if (this.game.fields[i - 1][j].bomb) {
            bombs++;
          }
        }
        if (j > 0) {
          if (this.game.fields[i][j - 1].bomb) {
            bombs++;
          }
        }
        if (i < this.sizeX - 1) {
          if (this.game.fields[i + 1][j].bomb) {
            bombs++;
          }
        }
        if (j < this.sizeY - 1) {
          if (this.game.fields[i][j + 1].bomb) {
            bombs++;
          }
        }
        if (i > 0 && j > 0) {
          if (this.game.fields[i - 1][j - 1].bomb) {
            bombs++;
          }
        }
        if (i < this.sizeX - 1 && j < this.sizeY - 1) {
          if (this.game.fields[i + 1][j + 1].bomb) {
            bombs++;
          }
        }
        if (i > 0 && j < this.sizeY - 1) {
          if (this.game.fields[i - 1][j + 1].bomb) {
            bombs++;
          }
        }
        if (i < this.sizeX - 1 && j > 0) {
          if (this.game.fields[i + 1][j - 1].bomb) {
            bombs++;
          }
        }
        this.game.fields[i][j].neighbours = bombs;
      }
    }
  }

  random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
