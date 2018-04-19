import { Component, OnInit, OnDestroy, DoCheck, Input } from '@angular/core';
import { Neighbour, Game, Leaderboard, GameSize, Name } from './field';
import { HttpgetService } from '../httpget.service';
import { HttpputService } from '../httpput.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FieldsizeService } from '../fieldsize.service';

@Component({
  selector: 'app-minesweeper-modal',
  templateUrl: './modal.html'
})
export class MinesweeperModalComponent implements DoCheck {
  public size: GameSize = { sizeX: undefined, sizeY: undefined, bombs: undefined };
  public max: number;
  public mode = 'retarded';
  public custom = false;

  constructor(public activeModal: NgbActiveModal, private fieldService: FieldsizeService) {}

  ngDoCheck() {
    if (this.mode === 'retarded') {
      this.size = { sizeX: 9, sizeY: 9, bombs: 10 };
    }
    if (this.mode === 'median') {
      this.size = { sizeX: 16, sizeY: 16, bombs: 40 };
    }
    if (this.mode === 'mexican') {
      this.size = { sizeX: 16, sizeY: 30, bombs: 99 };
    }
    if (this.mode === 'custom') {
      this.custom = true;
    } else {
      this.custom = false;
    }
    this.max = this.size.sizeX * this.size.sizeY - 2;
  }

  done() {
    if (this.size.sizeY > 3 && this.size.sizeX > 3 && this.size.bombs > 1 && this.size.bombs < this.size.sizeX * this.size.sizeY - 1) {
      this.fieldService.Size = this.size;
      this.activeModal.close();
    }
  }
}

@Component({
  selector: 'app-minesweeper-modal',
  templateUrl: './save.html'
})
export class SaveComponent {
  @Input() time;
  public name: Name = { name: undefined, save: false };

  constructor(public activeModal: NgbActiveModal, private fieldService: FieldsizeService) {}

  yes() {
    this.name.save = true;
  }

  save() {
    this.fieldService.Name = this.name;
    this.activeModal.close();
  }

  cancel() {
    this.name.save = false;
    this.fieldService.Name = this.name;
    this.activeModal.close();
  }

  no() {
    this.fieldService.Name = this.name;
    this.activeModal.close();
  }
}

@Component({
  selector: 'app-minesweeper',
  templateUrl: './minesweeper.component.html'
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
  public leaderboard: Leaderboard = { people: [], easy: [], medium: [], hard: [] };
  private timeInt;
  private leaderInt;

  constructor(
    private httpGet: HttpgetService,
    private httpPut: HttpputService,
    private modalService: NgbModal,
    private sizeService: FieldsizeService
  ) {
    this.modalService.open(MinesweeperModalComponent, { centered: true }).result.then(() => {
      this.game.sizeX = this.sizeService.Size.sizeX;
      this.game.sizeY = this.sizeService.Size.sizeY;
      this.game.bombs = this.sizeService.Size.bombs;
      this.game.flags = this.game.bombs;
      this.initGame();
    });
  }

  ngOnInit() {
    this.leaderInt = setInterval(() => {
      this.httpGet.getLeaderboard().then(res => {
        this.leaderboard = res;
      });
    }, 5000);
  }

  ngOnDestroy() {
    clearInterval(this.leaderInt);
  }

  async initGame() {
    this.game.fields = [];
    this.game.win = false;
    this.game.lose = false;
    this.game.running = false;
    this.game.time = 0;

    for (let i = 0; i < this.game.sizeX; i++) {
      await this.game.fields.push([]);
    }

    for (let i = 0; i < this.game.sizeX; i++) {
      for (let j = this.game.fields[i].length; j < this.game.sizeY; j++) {
        await this.game.fields[i].push({ bomb: false, click: false, flag: false, image: 'default', neighbours: 0, x: i, y: j });
      }
    }
  }

  async resetGame() {
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
        await this.game.fields[i].push({ bomb: false, click: false, flag: false, image: 'default', neighbours: 0, x: i, y: j });
      }
    }
  }

  async reloadGame() {
    await this.modalService.open(MinesweeperModalComponent, { centered: true }).result.then(() => {
      this.game.sizeX = this.sizeService.Size.sizeX;
      this.game.sizeY = this.sizeService.Size.sizeY;
      this.game.bombs = this.sizeService.Size.bombs;
      this.game.flags = this.game.bombs;
      this.initGame();
    });
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
          const save = this.modalService.open(SaveComponent, { centered: true });
          save.componentInstance.time = this.game.time;
          save.result.then(() => {
            if (this.sizeService.Name.save) {
              if (this.game.sizeX === 9 && this.game.sizeY === 9 && this.game.bombs === 10) {
                this.leaderboard.easy.push({
                  name: this.sizeService.Name.name,
                  time: this.game.time,
                  bomb_count: this.game.bombs,
                  x: this.game.sizeY,
                  y: this.game.sizeX,
                  field_size: this.game.sizeY + 'x' + this.game.sizeX
                });
              } else if (this.game.sizeX === 16 && this.game.sizeY === 16 && this.game.bombs === 40) {
                this.leaderboard.medium.push({
                  name: this.sizeService.Name.name,
                  time: this.game.time,
                  bomb_count: this.game.bombs,
                  x: this.game.sizeY,
                  y: this.game.sizeX,
                  field_size: this.game.sizeY + 'x' + this.game.sizeX
                });
              } else if (this.game.sizeX === 16 && this.game.sizeY === 30 && this.game.bombs === 99) {
                this.leaderboard.hard.push({
                  name: this.sizeService.Name.name,
                  time: this.game.time,
                  bomb_count: this.game.bombs,
                  x: this.game.sizeY,
                  y: this.game.sizeX,
                  field_size: this.game.sizeY + 'x' + this.game.sizeX
                });
              } else {
                this.leaderboard.people.push({
                  name: this.sizeService.Name.name,
                  time: this.game.time,
                  bomb_count: this.game.bombs,
                  x: this.game.sizeY,
                  y: this.game.sizeX,
                  field_size: this.game.sizeY + 'x' + this.game.sizeX
                });
              }
              this.sorting();
              this.httpPut.putLeaderboard(this.leaderboard).then(res => {
                this.leaderboard = res;
              });
            }
          });
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
    if (!this.game.lose && !this.game.win && this.game.running && !this.game.fields[x][y].click) {
      this.game.fields[x][y].flag = !this.game.fields[x][y].flag;
      if (this.game.fields[x][y].flag) {
        this.game.fields[x][y].image = 'flag';
        this.game.flags--;
      } else {
        this.game.fields[x][y].image = 'default';
        this.game.flags++;
      }
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
    this.leaderboard.easy.sort((leftSide, rightSide): number => {
      if (leftSide.time < rightSide.time) {
        return -1;
      }
      if (leftSide.time > rightSide.time) {
        return 1;
      }
      return 0;
    });
    this.leaderboard.medium.sort((leftSide, rightSide): number => {
      if (leftSide.time < rightSide.time) {
        return -1;
      }
      if (leftSide.time > rightSide.time) {
        return 1;
      }
      return 0;
    });
    this.leaderboard.hard.sort((leftSide, rightSide): number => {
      if (leftSide.time < rightSide.time) {
        return -1;
      }
      if (leftSide.time > rightSide.time) {
        return 1;
      }
      return 0;
    });
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
