import { Component, OnInit } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpgetService } from '../httpget.service';

import * as itf from '../schueler';

@Component({
  selector: 'app-last-week',
  templateUrl: './last-week.component.html'
})
export class LastWeekComponent implements OnInit {
  private schuelers: itf.Schueler[];
  private essen = { montag: '', dienstag: '', mittwoch: '', donnerstag: '', freitag: '' };

  constructor(private httpgetService: HttpgetService) {}

  ngOnInit() {
    this.httpgetService
      .getLast()
      .then(res => {
        this.schuelers = res;
      })
      .catch(err => {});
    this.httpgetService
      .getLastEssen()
      .then(res => {
        this.essen = res;
      })
      .catch(err => {});
  }
}
