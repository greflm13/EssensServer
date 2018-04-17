import { Component, OnInit, OnDestroy } from '@angular/core';
import { Neighbour, Game, Leaderboard } from './field';
import { HttpgetService } from '../httpget.service';
import { HttpputService } from '../httpput.service';

@Component({
  selector: 'app-minesweeper',
  templateUrl: './minesweeper.component.html',
  styleUrls: ['./minesweeper.component.css']
})
export class MinesweeperComponent implements OnInit, OnDestroy {
  public game: Game = {
    fields: [],
    win: false,
    lose: false,
    running: false,
    bombs: undefined,
    flags: undefined,
    sizeX: undefined,
    sizeY: undefined,
    time: 0
  };
  public leaderboard: Leaderboard = { people: [] };
  private timeInt;
  private leaderInt;

  constructor(private httpGet: HttpgetService, private httpPut: HttpputService) {}

  ngOnInit() {
    this.leaderInt = setInterval(() => {
      this.httpGet.getLeaderboard().then(res => {
        this.leaderboard = res;
      });
    }, 5000);

    this.initGame();
  }

  ngOnDestroy() {
    clearInterval(this.leaderInt);
  }

  initGame() {
    this.game = {
      fields: [],
      win: false,
      lose: false,
      running: false,
      bombs: undefined,
      flags: undefined,
      sizeX: undefined,
      sizeY: undefined,
      time: 0
    };
    do {
      const y = prompt('Größe des Feldes in X - Richtung (Sinnvoll < 100):');
      if (!isNaN(parseInt(y, 10))) {
        if (parseInt(y, 10) > 1) {
          this.game.sizeY = parseInt(y, 10);
        }
      }
    } while (this.game.sizeY === undefined || this.game.sizeY === null || this.game.sizeY === 0);

    do {
      const x = prompt('Größe des Feldes in Y - Richtung (sinnvoll < 100):');
      if (!isNaN(parseInt(x, 10))) {
        if (parseInt(x, 10) > 1) {
          this.game.sizeX = parseInt(x, 10);
        }
      }
    } while (this.game.sizeX === undefined || this.game.sizeX === null || this.game.sizeX === 0);

    do {
      const bombs = prompt('Anzahl der Bomben (max ' + (this.game.sizeX * this.game.sizeY - 2) + '):');
      if (!isNaN(parseInt(bombs, 10))) {
        if (parseInt(bombs, 10) <= this.game.sizeX * this.game.sizeY - 2 && parseInt(bombs, 10) > 0) {
          this.game.flags = parseInt(bombs, 10);
          this.game.bombs = this.game.flags;
        }
      }
    } while (this.game.flags === undefined || this.game.flags === null || this.game.flags === 0);

    for (let i = 0; i < this.game.sizeX; i++) {
      this.game.fields.push([]);
    }

    for (let i = 0; i < this.game.sizeX; i++) {
      for (let j = this.game.fields[i].length; j < this.game.sizeY; j++) {
        this.game.fields[i].push({ bomb: false, click: false, flag: false, image: 'default', neighbours: 0, x: i, y: j });
      }
    }
  }

  resetGame() {
    this.game.win = false;
    this.game.lose = false;
    this.game.time = 0;
    this.game.flags = this.game.bombs;
    this.game.fields = [];

    for (let i = 0; i < this.game.sizeX; i++) {
      this.game.fields.push([]);
    }

    for (let i = 0; i < this.game.sizeX; i++) {
      for (let j = this.game.fields[i].length; j < this.game.sizeY; j++) {
        this.game.fields[i].push({ bomb: false, click: false, flag: false, image: 'default', neighbours: 0, x: i, y: j });
      }
    }
  }

  startGame(x: number, y: number) {
    this.timeInt = setInterval(() => {
      this.game.time++;
    }, 1000);
    this.game.running = true;

    for (let i = 0; i < this.game.flags; i++) {
      const sx = this.random(0, this.game.sizeX - 1);
      const sy = this.random(0, this.game.sizeY - 1);
      if (!this.game.fields[sx][sy].bomb && !(sx === x && sy === y)) {
        this.game.fields[sx][sy].bomb = true;
      } else {
        i--;
      }
    }
    this.countBombs();
  }

  async check(x: number, y: number) {
    if (!this.game.running) {
      this.startGame(x, y);
    }
    if (!this.game.lose && !this.game.win && !this.game.fields[x][y].flag) {
      if (this.game.fields[x][y].bomb) {
        this.game.lose = true;
        this.game.running = false;
        clearInterval(this.timeInt);
        await this.game.fields.forEach(fields => {
          fields.forEach(field => {
            if (field.bomb && !field.flag) {
              field.image = 'bomb';
            }
            if (field.flag && !field.bomb) {
              field.image = 'flag_wrong';
            }
          });
        });
        this.game.fields[x][y].image = 'boom';
        alert('You lose!');
      } else {
        this.setPicture(x, y);
        this.checkAll(x, y);
        let unopened = 0;
        await this.game.fields.forEach(fields => {
          fields.forEach(field => {
            if (!field.click) {
              unopened++;
            }
          });
        });
        if (this.game.bombs === unopened) {
          this.game.win = true;
          this.game.running = false;
          clearInterval(this.timeInt);
          const save = confirm('You Win! Your Time: ' + this.game.time + ' Save to leaderboard?');
          if (save) {
            let name: string;
            do {
              name = prompt('Name:');
            } while (name === undefined || name === null || name === '');
            if (name !== undefined && name !== null && name !== '') {
              this.leaderboard.people.push({
                name: name,
                time: this.game.time,
                bomb_count: this.game.bombs,
                x: this.game.sizeY,
                y: this.game.sizeX,
                field_size: this.game.sizeY + 'x' + this.game.sizeX
              });
              this.sorting();
              this.httpPut.putLeaderboard(this.leaderboard).then(res => {
                this.leaderboard = res;
              });
            }
          }
        }
      }
    }
  }

  checkAll(x: number, y: number) {
    if (this.game.fields[x][y].neighbours === 0) {
      const neighbours: Neighbour[] = [];
      if (x > 0) {
        if (!this.game.fields[x - 1][y].click) {
          neighbours.push({ x: x - 1, y: y });
        }
        if (!this.game.fields[x - 1][y].flag) {
          this.setPicture(x - 1, y);
        }
      }
      if (y > 0) {
        if (!this.game.fields[x][y - 1].click) {
          neighbours.push({ x: x, y: y - 1 });
        }
        if (!this.game.fields[x][y - 1].flag) {
          this.setPicture(x, y - 1);
        }
      }
      if (x < this.game.sizeX - 1) {
        if (!this.game.fields[x + 1][y].click) {
          neighbours.push({ x: x + 1, y: y });
        }
        if (!this.game.fields[x + 1][y].flag) {
          this.setPicture(x + 1, y);
        }
      }
      if (y < this.game.sizeY - 1) {
        if (!this.game.fields[x][y + 1].click) {
          neighbours.push({ x: x, y: y + 1 });
        }
        if (!this.game.fields[x][y + 1].flag) {
          this.setPicture(x, y + 1);
        }
      }
      if (x > 0 && y > 0) {
        if (!this.game.fields[x - 1][y - 1].click) {
          neighbours.push({ x: x - 1, y: y - 1 });
        }
        if (!this.game.fields[x - 1][y - 1].flag) {
          this.setPicture(x - 1, y - 1);
        }
      }
      if (x < this.game.sizeX - 1 && y < this.game.sizeY - 1) {
        if (!this.game.fields[x + 1][y + 1].click) {
          neighbours.push({ x: x + 1, y: y + 1 });
        }
        if (!this.game.fields[x + 1][y + 1].flag) {
          this.setPicture(x + 1, y + 1);
        }
      }
      if (x > 0 && y < this.game.sizeY - 1) {
        if (!this.game.fields[x - 1][y + 1].click) {
          neighbours.push({ x: x - 1, y: y + 1 });
        }
        if (!this.game.fields[x - 1][y + 1].flag) {
          this.setPicture(x - 1, y + 1);
        }
      }
      if (x < this.game.sizeX - 1 && y > 0) {
        if (!this.game.fields[x + 1][y - 1].click) {
          neighbours.push({ x: x + 1, y: y - 1 });
        }
        if (!this.game.fields[x + 1][y - 1].flag) {
          this.setPicture(x + 1, y - 1);
        }
      }
      neighbours.forEach(field => {
        this.checkAll(field.x, field.y);
      });
    }
  }

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
    if (!this.game.lose && !this.game.win && this.game.running && this.game.fields[x][y].flag) {
      this.game.fields[x][y].image = 'default';
      this.game.flags++;
    }
    if (this.game.flags > 0) {
      if (!this.game.lose && !this.game.win && this.game.running && !this.game.fields[x][y].click) {
        this.game.fields[x][y].flag = !this.game.fields[x][y].flag;
        if (this.game.fields[x][y].flag) {
          this.game.fields[x][y].image = 'flag';
          this.game.flags--;
        }
      }
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
        if (i < this.game.sizeX - 1) {
          if (this.game.fields[i + 1][j].bomb) {
            bombs++;
          }
        }
        if (j < this.game.sizeY - 1) {
          if (this.game.fields[i][j + 1].bomb) {
            bombs++;
          }
        }
        if (i > 0 && j > 0) {
          if (this.game.fields[i - 1][j - 1].bomb) {
            bombs++;
          }
        }
        if (i < this.game.sizeX - 1 && j < this.game.sizeY - 1) {
          if (this.game.fields[i + 1][j + 1].bomb) {
            bombs++;
          }
        }
        if (i > 0 && j < this.game.sizeY - 1) {
          if (this.game.fields[i - 1][j + 1].bomb) {
            bombs++;
          }
        }
        if (i < this.game.sizeX - 1 && j > 0) {
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

  sorting() {
    this.leaderboard.people.sort((leftSide, rightSide): number => {
      if (leftSide.bomb_count > rightSide.bomb_count) {
        return -1;
      }
      if (leftSide.bomb_count < rightSide.bomb_count) {
        return 1;
      } else {
        if (leftSide.x < rightSide.x) {
          return -1;
        }
        if (leftSide.x > rightSide.x) {
          return 1;
        } else {
          if (leftSide.y < rightSide.y) {
            return -1;
          }
          if (leftSide.y > rightSide.y) {
            return 1;
          } else {
            if (leftSide.time < rightSide.time) {
              return -1;
            }
            if (leftSide.time > rightSide.time) {
              return 1;
            }
            return 0;
          }
        }
      }
    });
  }
}
