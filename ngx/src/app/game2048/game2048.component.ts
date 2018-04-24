import { Component, OnInit, HostListener, Input } from '@angular/core';
import { Game } from './2048';
import { Leaderboard, Name } from '../minesweeper/field';
import { HttpgetService } from '../httpget.service';
import { HttpputService } from '../httpput.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FieldsizeService } from '../fieldsize.service';

@Component({
  selector: 'app-minesweeper-modal',
  templateUrl: './save.html'
})
export class Save2048Component {
  @Input() time;
  public name: Name = { name: undefined, save: false };

  constructor(public activeModal: NgbActiveModal, private fieldService: FieldsizeService) {}

  yes() {
    this.name.save = true;
  }

  save() {
    this.name.save = true;
    this.fieldService.Name = this.name;
    this.activeModal.close();
  }

  cancel() {
    this.name.save = false;
    this.fieldService.Name = this.name;
    this.activeModal.close();
  }

  no() {
    this.name.save = false;
    this.fieldService.Name = this.name;
    this.activeModal.close();
  }
}

@Component({
  selector: 'app-game2048',
  templateUrl: './game2048.component.html',
  styleUrls: ['./game2048.component.css']
})
export class Game2048Component implements OnInit {
  public game: Game = { fields: [], lose: false, score: 0, win: false, running: false, time: 0 };
  public leaderboard: Leaderboard = { minesweeper: { easy: [], medium: [], hard: [], people: [] }, g2048: { people: [] } };
  private last: Touch;
  private mvcnt = 0;
  private timeInt;
  private leaderInt;

  @HostListener('touchend', ['$event'])
  ontouchend(event: TouchEvent) {
    if (event.changedTouches[0].target.toString().startsWith('[object HTMLSpanElement]')) {
      this.ngOnInit();
      return;
    }
    if (event.changedTouches[0].target.toString().startsWith('[object HTMLLabelElement]')) {
      this.save();
    }
    this.game.fields.forEach(fields => {
      fields.forEach(field => {
        field.color = '';
      });
    });
    this.mvcnt = 0;
    event.preventDefault();
    if (
      event.changedTouches[0].pageX - this.last.pageX > 30 &&
      this.game.running &&
      event.changedTouches[0].pageX - this.last.pageX > event.changedTouches[0].pageY - this.last.pageY
    ) {
      this.right();
    }

    if (
      event.changedTouches[0].pageX - this.last.pageX < -30 &&
      this.game.running &&
      event.changedTouches[0].pageX - this.last.pageX < event.changedTouches[0].pageY - this.last.pageY
    ) {
      this.left();
    }

    if (
      event.changedTouches[0].pageY - this.last.pageY > 30 &&
      this.game.running &&
      event.changedTouches[0].pageY - this.last.pageY > event.changedTouches[0].pageX - this.last.pageX
    ) {
      this.down();
    }

    if (
      event.changedTouches[0].pageY - this.last.pageY < -30 &&
      this.game.running &&
      event.changedTouches[0].pageY - this.last.pageY < event.changedTouches[0].pageX - this.last.pageX
    ) {
      this.up();
    }

    this.afterMove();
    return 0;
  }

  @HostListener('touchstart', ['$event'])
  ontouchstart(event: TouchEvent) {
    this.last = event.changedTouches[0];
    event.preventDefault();
  }

  constructor(
    private httpGet: HttpgetService,
    private httpPost: HttpputService,
    private sizeService: FieldsizeService,
    private modalService: NgbModal
  ) {}

  save() {
    clearInterval(this.timeInt);
    this.game.running = false;
    const save = this.modalService.open(Save2048Component, { centered: true });
    save.componentInstance.time = this.game.time;
    save.result.then(() => {
      if (this.sizeService.Name.save) {
        this.leaderboard.g2048.people.push({
          name: this.sizeService.Name.name,
          time: this.game.time,
          score: this.game.score
        });
        this.sorting();
        this.httpPost.putLeaderboard(this.leaderboard).then(res => {
          this.leaderboard = res;
        });
      }
    });
  }

  async ngOnInit() {
    this.game.fields = [];
    this.game.running = false;
    this.game.win = false;
    this.game.lose = false;
    this.game.score = 0;
    this.game.time = 0;
    clearInterval(this.timeInt);
    clearInterval(this.leaderInt);

    this.leaderInt = setInterval(() => {
      this.httpGet.getLeaderboard().then(res => {
        this.leaderboard = res;
      });
    }, 10000);

    for (let i = 0; i < 4; i++) {
      this.game.fields.push([]);
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        await this.game.fields[i].push({ number: 0, color: 'n0', merged: false });
      }
    }

    const sx = this.random(0, 3);
    const sy = this.random(0, 3);
    this.game.fields[sx][sy].number = 2;
    this.game.fields[sx][sy].color = 'pop';
    this.game.running = true;
    this.timeInt = setInterval(() => {
      this.game.time++;
    }, 1000);
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
    if (!this.game.lose) {
      switch (event.key) {
        case 'ArrowUp':
          this.up();
          event.preventDefault();
          break;
        case 'ArrowDown':
          this.down();
          event.preventDefault();
          break;
        case 'ArrowLeft':
          this.left();
          event.preventDefault();
          break;
        case 'ArrowRight':
          this.right();
          event.preventDefault();
          break;
        default:
          break;
      }
      this.afterMove();
    }
  }

  async afterMove() {
    this.game.fields.forEach(fields => {
      fields.forEach(field => {
        field.merged = false;
      });
    });
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
      if (
        this.game.fields[i][0].number === this.game.fields[i][1].number &&
        !(this.game.fields[i][0].number === 0) &&
        !this.game.fields[i][0].merged
      ) {
        this.game.fields[i][0].number += this.game.fields[i][1].number;
        this.game.score += this.game.fields[i][0].number;
        this.game.fields[i][1].number = 0;
        this.game.fields[i][0].merged = true;
        this.mvcnt++;
      } else if (this.game.fields[i][0].number === 0 && !(this.game.fields[i][1].number === 0)) {
        this.game.fields[i][0].number = this.game.fields[i][1].number;
        this.game.fields[i][1].number = 0;
        this.mvcnt++;
      }

      if (
        this.game.fields[i][1].number === this.game.fields[i][2].number &&
        !(this.game.fields[i][1].number === 0) &&
        !this.game.fields[i][1].merged
      ) {
        this.game.fields[i][1].number += this.game.fields[i][2].number;
        this.game.score += this.game.fields[i][1].number;
        this.game.fields[i][2].number = 0;
        this.game.fields[i][1].merged = true;
        this.mvcnt++;
      } else if (
        this.game.fields[i][0].number === this.game.fields[i][2].number &&
        this.game.fields[i][1].number === 0 &&
        !(this.game.fields[i][0].number === 0) &&
        !this.game.fields[i][0].merged
      ) {
        this.game.fields[i][0].number += this.game.fields[i][2].number;
        this.game.score += this.game.fields[i][0].number;
        this.game.fields[i][2].number = 0;
        this.game.fields[i][0].merged = true;
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

      if (
        this.game.fields[i][2].number === this.game.fields[i][3].number &&
        !(this.game.fields[i][2].number === 0) &&
        !this.game.fields[i][2].merged
      ) {
        this.game.fields[i][2].number += this.game.fields[i][3].number;
        this.game.score += this.game.fields[i][2].number;
        this.game.fields[i][3].number = 0;
        this.game.fields[i][2].merged = true;
        this.mvcnt++;
      } else if (
        this.game.fields[i][1].number === this.game.fields[i][3].number &&
        this.game.fields[i][2].number === 0 &&
        !(this.game.fields[i][3].number === 0) &&
        !this.game.fields[i][1].merged
      ) {
        this.game.fields[i][1].number += this.game.fields[i][3].number;
        this.game.score += this.game.fields[i][1].number;
        this.game.fields[i][3].number = 0;
        this.game.fields[i][1].merged = true;
        this.mvcnt++;
      } else if (
        this.game.fields[i][0].number === this.game.fields[i][3].number &&
        this.game.fields[i][1].number === 0 &&
        !(this.game.fields[i][3].number === 0) &&
        !this.game.fields[i][0].merged
      ) {
        this.game.fields[i][0].number += this.game.fields[i][3].number;
        this.game.score += this.game.fields[i][0].number;
        this.game.fields[i][3].number = 0;
        this.game.fields[i][0].merged = true;
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
      if (
        this.game.fields[i][3].number === this.game.fields[i][2].number &&
        !(this.game.fields[i][2].number === 0) &&
        !this.game.fields[i][3].merged
      ) {
        this.game.fields[i][3].number += this.game.fields[i][2].number;
        this.game.score += this.game.fields[i][3].number;
        this.game.fields[i][2].number = 0;
        this.game.fields[i][3].merged = true;
        this.mvcnt++;
      } else if (this.game.fields[i][3].number === 0 && !(this.game.fields[i][2].number === 0)) {
        this.game.fields[i][3].number = this.game.fields[i][2].number;
        this.game.fields[i][2].number = 0;
        this.mvcnt++;
      }

      if (
        this.game.fields[i][2].number === this.game.fields[i][1].number &&
        !(this.game.fields[i][1].number === 0) &&
        !this.game.fields[i][2].merged
      ) {
        this.game.fields[i][2].number += this.game.fields[i][1].number;
        this.game.score += this.game.fields[i][2].number;
        this.game.fields[i][1].number = 0;
        this.game.fields[i][2].merged = true;
        this.mvcnt++;
      } else if (
        this.game.fields[i][3].number === this.game.fields[i][1].number &&
        this.game.fields[i][2].number === 0 &&
        !(this.game.fields[i][1].number === 0) &&
        !this.game.fields[i][3].merged
      ) {
        this.game.fields[i][3].number += this.game.fields[i][1].number;
        this.game.score += this.game.fields[i][3].number;
        this.game.fields[i][1].number = 0;
        this.game.fields[i][3].merged = true;
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

      if (
        this.game.fields[i][1].number === this.game.fields[i][0].number &&
        !(this.game.fields[i][0].number === 0) &&
        !this.game.fields[i][1].merged
      ) {
        this.game.fields[i][1].number += this.game.fields[i][0].number;
        this.game.score += this.game.fields[i][1].number;
        this.game.fields[i][0].number = 0;
        this.game.fields[i][1].merged = true;
        this.mvcnt++;
      } else if (
        this.game.fields[i][2].number === this.game.fields[i][0].number &&
        this.game.fields[i][1].number === 0 &&
        !(this.game.fields[i][0].number === 0) &&
        !this.game.fields[i][2].merged
      ) {
        this.game.fields[i][2].number += this.game.fields[i][0].number;
        this.game.score += this.game.fields[i][2].number;
        this.game.fields[i][0].number = 0;
        this.game.fields[i][2].merged = true;
        this.mvcnt++;
      } else if (
        this.game.fields[i][3].number === this.game.fields[i][0].number &&
        this.game.fields[i][2].number === 0 &&
        !(this.game.fields[i][0].number === 0) &&
        !this.game.fields[i][3].merged
      ) {
        this.game.fields[i][3].number += this.game.fields[i][0].number;
        this.game.score += this.game.fields[i][3].number;
        this.game.fields[i][0].number = 0;
        this.game.fields[i][3].merged = true;
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
      if (
        this.game.fields[0][i].number === this.game.fields[1][i].number &&
        !(this.game.fields[1][i].number === 0) &&
        !this.game.fields[0][i].merged
      ) {
        this.game.fields[0][i].number += this.game.fields[1][i].number;
        this.game.score += this.game.fields[0][i].number;
        this.game.fields[1][i].number = 0;
        this.game.fields[0][i].merged = true;
        this.mvcnt++;
      } else if (this.game.fields[0][i].number === 0 && !(this.game.fields[1][i].number === 0)) {
        this.game.fields[0][i].number = this.game.fields[1][i].number;
        this.game.fields[1][i].number = 0;
        this.mvcnt++;
      }

      if (
        this.game.fields[1][i].number === this.game.fields[2][i].number &&
        !(this.game.fields[2][i].number === 0) &&
        !this.game.fields[1][i].merged
      ) {
        this.game.fields[1][i].number += this.game.fields[2][i].number;
        this.game.score += this.game.fields[1][i].number;
        this.game.fields[2][i].number = 0;
        this.game.fields[1][i].merged = true;
        this.mvcnt++;
      } else if (
        this.game.fields[0][i].number === this.game.fields[2][i].number &&
        this.game.fields[1][i].number === 0 &&
        !(this.game.fields[2][i].number === 0) &&
        !this.game.fields[2][i].merged
      ) {
        this.game.fields[0][i].number += this.game.fields[2][i].number;
        this.game.score += this.game.fields[0][i].number;
        this.game.fields[2][i].number = 0;
        this.game.fields[0][i].merged = true;
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

      if (
        this.game.fields[2][i].number === this.game.fields[3][i].number &&
        !(this.game.fields[3][i].number === 0) &&
        !this.game.fields[2][i].merged
      ) {
        this.game.fields[2][i].number += this.game.fields[3][i].number;
        this.game.score += this.game.fields[2][i].number;
        this.game.fields[3][i].number = 0;
        this.game.fields[2][i].merged = true;
        this.mvcnt++;
      } else if (
        this.game.fields[1][i].number === this.game.fields[3][i].number &&
        this.game.fields[2][i].number === 0 &&
        !(this.game.fields[3][i].number === 0) &&
        !this.game.fields[1][i].merged
      ) {
        this.game.fields[1][i].number += this.game.fields[3][i].number;
        this.game.score += this.game.fields[1][i].number;
        this.game.fields[3][i].number = 0;
        this.game.fields[1][i].merged = true;
        this.mvcnt++;
      } else if (
        this.game.fields[0][i].number === this.game.fields[3][i].number &&
        this.game.fields[1][i].number === 0 &&
        !(this.game.fields[3][i].number === 0) &&
        !this.game.fields[0][i].merged
      ) {
        this.game.fields[0][i].number += this.game.fields[3][i].number;
        this.game.score += this.game.fields[0][i].number;
        this.game.fields[3][i].number = 0;
        this.game.fields[0][i].merged = true;
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
      if (
        this.game.fields[3][i].number === this.game.fields[2][i].number &&
        !(this.game.fields[2][i].number === 0) &&
        !this.game.fields[3][i].merged
      ) {
        this.game.fields[3][i].number += this.game.fields[2][i].number;
        this.game.score += this.game.fields[3][i].number;
        this.game.fields[2][i].number = 0;
        this.game.fields[3][i].merged = true;
        this.mvcnt++;
      } else if (this.game.fields[3][i].number === 0 && !(this.game.fields[2][i].number === 0)) {
        this.game.fields[3][i].number = this.game.fields[2][i].number;
        this.game.fields[2][i].number = 0;
        this.mvcnt++;
      }

      if (
        this.game.fields[2][i].number === this.game.fields[1][i].number &&
        !(this.game.fields[1][i].number === 0) &&
        !this.game.fields[2][i].merged
      ) {
        this.game.fields[2][i].number += this.game.fields[1][i].number;
        this.game.score += this.game.fields[2][i].number;
        this.game.fields[1][i].number = 0;
        this.game.fields[2][i].merged = true;
        this.mvcnt++;
      } else if (
        this.game.fields[3][i].number === this.game.fields[1][i].number &&
        this.game.fields[2][i].number === 0 &&
        !(this.game.fields[1][i].number === 0) &&
        !this.game.fields[3][i].merged
      ) {
        this.game.fields[3][i].number += this.game.fields[1][i].number;
        this.game.score += this.game.fields[3][i].number;
        this.game.fields[1][i].number = 0;
        this.game.fields[3][i].merged = true;
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

      if (
        this.game.fields[1][i].number === this.game.fields[0][i].number &&
        !(this.game.fields[0][i].number === 0) &&
        !this.game.fields[1][i].merged
      ) {
        this.game.fields[1][i].number += this.game.fields[0][i].number;
        this.game.score += this.game.fields[1][i].number;
        this.game.fields[0][i].number = 0;
        this.game.fields[1][i].merged = true;
        this.mvcnt++;
      } else if (
        this.game.fields[2][i].number === this.game.fields[0][i].number &&
        this.game.fields[1][i].number === 0 &&
        !(this.game.fields[0][i].number === 0) &&
        !this.game.fields[2][i].merged
      ) {
        this.game.fields[2][i].number += this.game.fields[0][i].number;
        this.game.score += this.game.fields[2][i].number;
        this.game.fields[0][i].number = 0;
        this.game.fields[2][i].merged = true;
        this.mvcnt++;
      } else if (
        this.game.fields[3][i].number === this.game.fields[0][i].number &&
        this.game.fields[2][i].number === 0 &&
        !(this.game.fields[0][i].number === 0) &&
        !this.game.fields[3][i].merged
      ) {
        this.game.fields[3][i].number += this.game.fields[0][i].number;
        this.game.score += this.game.fields[3][i].number;
        this.game.fields[0][i].number = 0;
        this.game.fields[3][i].merged = true;
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

  sorting() {
    this.leaderboard.g2048.people.sort((leftSide, rightSide): number => {
      if (leftSide.score > rightSide.score) {
        return -1;
      }
      if (leftSide.score < rightSide.score) {
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
    });
  }

  random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
