import { Component, OnInit } from '@angular/core';
import { Field, Game } from './field';

@Component({
  selector: 'app-minesweeper',
  templateUrl: './minesweeper.component.html',
  styleUrls: ['./minesweeper.component.css']
})
export class MinesweeperComponent implements OnInit {
  public win = false;
  public lose = false;
  public game: Game = { fields: [] };

  constructor() {}

  ngOnInit() {
    for (let i = 0; i < 256; i++) {
      this.game.fields.push({ bomb: false, click: false, flag: false, image: 'default', neighbours: 0 });
    }
    for (let i = 0; i < 16; i++) {
      this.game.fields[this.random(0, 255)].bomb = true;
    }
  }

  check(field: number) {
    if (!this.lose) {
      if (this.game.fields[field].bomb) {
        this.lose = true;
        window.alert('You lose!');
        for (let i = 0; i < this.game.fields.length; i++) {
          if (this.game.fields[i].bomb) {
            this.game.fields[i].image = 'bomb';
          }
        }
      } else {
        if (!this.game.fields[field].flag) {
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
  }

  onRightClick(event, field) {
    if (!this.lose && !this.game.fields[field].click) {
      this.game.fields[field].flag = !this.game.fields[field].flag;
      if (this.game.fields[field].flag) {
        this.game.fields[field].image = 'flag';
      } else {
        this.game.fields[field].image = 'default';
      }
    }
    return false;
  }

  random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
