import { Component } from '@angular/core';
import { HttpputService } from '../httpput.service';
import { Router } from '@angular/router';

import * as itf from '../schueler';

@Component({
  selector: 'app-speisen',
  templateUrl: './speisen.component.html'
})
export class SpeisenComponent {
  constructor(private httpputService: HttpputService, private router: Router) {}

  save(value: itf.Essen) {
    this.httpputService
      .putEssen(value)
      .then(() => {
        this.router.navigateByUrl('home');
      })
      .catch();
  }
}
