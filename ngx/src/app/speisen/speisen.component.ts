import { Component, OnInit } from '@angular/core';
import { HttpputService } from '../httpput.service';
import { Router } from '@angular/router';

import * as itf from '../schueler';
import { HttpgetService } from '../httpget.service';

@Component({
  selector: 'app-speisen',
  templateUrl: './speisen.component.html'
})
export class SpeisenComponent implements OnInit {
  public lockstate: boolean;
  public deltrue = false;
  public savetrue = false;

  constructor(private httpgetService: HttpgetService, private httpputService: HttpputService, private router: Router) {}

  save(value: itf.Essen) {
    this.httpputService
      .putEssen(value)
      .then(() => {
        this.savetrue = true;
        setTimeout(() => {
          this.savetrue = false;
        }, 2000);
      })
      .catch();
  }

  ngOnInit() {
    this.httpgetService.getLock().then(res => {
      this.lockstate = res.lock;
    });
  }

  changeState() {
    this.httpputService.putLock(!this.lockstate).then(res => {
      this.lockstate = res.lock;
    });
  }

  delete() {
    this.httpputService.putDelete().then(() => {
      this.deltrue = true;
      setTimeout(() => {
        this.deltrue = false;
      }, 2000);
    });
  }
}
