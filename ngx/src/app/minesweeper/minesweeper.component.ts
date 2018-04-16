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
  private reload: boolean;

  constructor() {}

  ngOnInit() {
    this.win = false;
    this.lose = false;
    this.reload = false;
    this.game = { fields: [] };
    do {
      const bombs = prompt('Anzahl der Bomben (max 256):');
      if (!isNaN(parseInt(bombs, 10))) {
        if (parseInt(bombs, 10) <= 256 || parseInt(bombs, 10) < 1) {
          this.flags = parseInt(bombs, 10);
        }
      }
    } while (this.flags === undefined || this.flags === null || this.flags === 0);
    for (let i = 0; i < 256; i++) {
      this.game.fields.push({ bomb: false, click: false, flag: false, image: 'default', neighbours: 0 });
    }
    for (let i = 0; i < this.flags; i++) {
      const rand = this.random(0, 255);
      if (!this.game.fields[rand].bomb) {
        this.game.fields[rand].bomb = true;
      } else {
        i--;
      }
    }
    this.countBombs();
  }

  check(field: number) {
    if (!this.lose) {
      if (this.game.fields[field].bomb) {
        this.lose = true;
        this.reload = confirm('You lose! Reload?');
        for (let i = 0; i < this.game.fields.length; i++) {
          if (this.game.fields[i].bomb) {
            this.game.fields[i].image = 'bomb';
          }
        }
      } else {
        if (!this.game.fields[field].flag) {
          switch (this.game.fields[field].neighbours) {
            case 1:
              this.game.fields[field].image = '1_bomb';
              break;
            case 2:
              this.game.fields[field].image = '2_bomb';
              break;
            case 3:
              this.game.fields[field].image = '3_bomb';
              break;
            case 4:
              this.game.fields[field].image = '4_bomb';
              break;
            case 5:
              this.game.fields[field].image = '5_bomb';
              break;
            case 6:
              this.game.fields[field].image = '6_bomb';
              break;
            case 7:
              this.game.fields[field].image = '7_bomb';
              break;
            case 8:
              this.game.fields[field].image = '8_bomb';
              break;
            default:
              this.game.fields[field].image = 'empty';
              break;
          }
        }
      }
    }

    if (this.reload) {
      this.ngOnInit();
    }
  }

  onRightClick(event, field) {
    if (this.game.fields[field].flag) {
      this.game.fields[field].image = 'default';
      this.flags++;
    }
    if (this.flags > 0) {
      if (!this.lose && !this.game.fields[field].click) {
        this.game.fields[field].flag = !this.game.fields[field].flag;
        if (this.game.fields[field].flag) {
          this.game.fields[field].image = 'flag';
          this.flags--;
        }
      }
      let bombswoutflag = 0;
      for (const funf of this.game.fields) {
        if (funf.bomb && !funf.flag) {
          bombswoutflag++;
        }
      }
      if (bombswoutflag === 0) {
        this.win = true;
        this.reload = confirm('You Win! Restart?');
        if (this.reload) {
          this.ngOnInit();
        }
      }
    } else {
      alert('Keine Flaggen mehr!');
    }
    return false;
  }

  countBombs() {
    for (let field = 0; field < this.game.fields.length; field++) {
      let bombs = 0;
      this.game.fields[field].click = true;
      if (
        field === 0 ||
        field === 16 ||
        field === 32 ||
        field === 48 ||
        field === 64 ||
        field === 80 ||
        field === 96 ||
        field === 112 ||
        field === 128 ||
        field === 144 ||
        field === 160 ||
        field === 176 ||
        field === 192 ||
        field === 208 ||
        field === 224 ||
        field === 240
      ) {
      } else {
        if (this.game.fields[field - 1].bomb) {
          bombs++;
        }
        if (field > 16) {
          if (this.game.fields[field - 17].bomb) {
            bombs++;
          }
        }
        if (field < 240) {
          if (this.game.fields[field + 15].bomb) {
            bombs++;
          }
        }
      }
      if (
        field === 15 ||
        field === 31 ||
        field === 47 ||
        field === 63 ||
        field === 79 ||
        field === 95 ||
        field === 111 ||
        field === 127 ||
        field === 143 ||
        field === 159 ||
        field === 175 ||
        field === 191 ||
        field === 207 ||
        field === 223 ||
        field === 239 ||
        field === 255
      ) {
      } else {
        if (this.game.fields[field + 1].bomb) {
          bombs++;
        }
        if (field > 16) {
          if (this.game.fields[field - 15].bomb) {
            bombs++;
          }
        }
        if (field < 240) {
          if (this.game.fields[field + 17].bomb) {
            bombs++;
          }
        }
      }
      if (field > 16) {
        if (this.game.fields[field - 16].bomb) {
          bombs++;
        }
      }
      if (field < 240) {
        if (this.game.fields[field + 16].bomb) {
          bombs++;
        }
      }
      switch (bombs) {
        case 1:
          this.game.fields[field].neighbours = 1;
          break;
        case 2:
          this.game.fields[field].neighbours = 2;
          break;
        case 3:
          this.game.fields[field].neighbours = 3;
          break;
        case 4:
          this.game.fields[field].neighbours = 4;
          break;
        case 5:
          this.game.fields[field].neighbours = 5;
          break;
        case 6:
          this.game.fields[field].neighbours = 6;
          break;
        case 7:
          this.game.fields[field].neighbours = 7;
          break;
        case 8:
          this.game.fields[field].neighbours = 8;
          break;
        default:
          this.game.fields[field].neighbours = 0;
          break;
      }
    }
  }

  random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
