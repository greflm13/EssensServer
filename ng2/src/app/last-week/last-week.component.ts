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

  constructor(private httpgetService: HttpgetService) { }

  ngOnInit() {
    this.httpgetService.getLast().then(res => {
      this.schuelers = res;
    });
  }

}
