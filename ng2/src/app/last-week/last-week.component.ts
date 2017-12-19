import { Component, OnInit } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpgetService } from '../httpget.service';

import * as itf from '../schueler';

@Component({
  selector: 'app-last-week',
  templateUrl: './last-week.component.html'
})
export class LastWeekComponent implements OnInit {
  public schuelers: itf.Schueler[];
  public essen = { montag: '', dienstag: '', mittwoch: '', donnerstag: '', freitag: '', woche: '' };

  constructor(private httpgetService: HttpgetService) { }

  ngOnInit() {
    this.httpgetService
      .getLast()
      .then(res => {
        this.schuelers = res;
      })
      .catch(err => { });
    this.httpgetService
      .getLastEssen()
      .then(res => {
        this.essen = res;
      })
      .catch(err => { });
  }
}
