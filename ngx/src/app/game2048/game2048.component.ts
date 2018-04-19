import { Component, OnInit, HostListener } from '@angular/core';
import { Game } from './game';

@Component({
  selector: 'app-game2048',
  templateUrl: './game2048.component.html',
  styleUrls: ['./game2048.component.css']
})
export class Game2048Component implements OnInit {
  public game: Game = { fields: [], lose: false, score: 0, win: false, image: 'default' };

  constructor() {}

  ngOnInit() {
    for (let i = 0; i < 4; i++) {
      this.game.fields.push([]);
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        this.game.fields[i].push({ number: 0 });
      }
    }

    const sx = this.random(0, 3);
    const sy = this.random(0, 3);
    this.game.fields[sx][sy].number = 2;
  }

  @HostListener('window:keyup', ['$event'])
  keyup(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      console.log('Up');
    }
    if (event.key === 'ArrowDown') {
      console.log('Down');
    }
    if (event.key === 'ArrowLeft') {
      console.log('Left');
    }
    if (event.key === 'ArrowRight') {
      console.log('Right');
    }
  }

  random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
