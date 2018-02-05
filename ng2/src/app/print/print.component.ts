import { Component, OnInit } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpgetService } from '../httpget.service';

import * as itf from '../schueler';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css']
})
export class PrintComponent implements OnInit {
  public schuelers: itf.Schueler[];
  public essen = { montag: '', dienstag: '', mittwoch: '', donnerstag: '', freitag: '', woche: '' };

  constructor(private httpgetService: HttpgetService) { }

  ngOnInit() {
    this.httpgetService
      .getSchuelers()
      .then(res => {
        this.schuelers = res;
      })
      .catch(err => { });
    this.httpgetService
      .getEssen()
      .then(res => {
        this.essen = res;
      })
      .catch(err => { });
  }

}
