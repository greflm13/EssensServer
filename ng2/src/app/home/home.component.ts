import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpgetService } from '../httpget.service';
import { HttpputService } from '../httpput.service';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

import * as itf from '../schueler';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  private schuelers: itf.Schueler[];
  private user: string;
  private class: string;
  private dmo = false;
  private ddi = false;
  private dmi = false;
  private ddo = false;
  private dfr = false;
  private montag: string;
  private dienstag: string;
  private mittwoch: string;
  private donnerstag: string;
  private freitag: string;
  private woche: string;

  @ViewChild('nameValid') public nameValid: NgbPopover;
  @ViewChild('classValid') public classValid: NgbPopover;

  constructor(private httpgetService: HttpgetService, private httpputService: HttpputService) { }

  ngOnInit() {
    this.httpgetService
      .getEssen()
      .then(res => {
        this.montag = res.montag;
        this.dienstag = res.dienstag;
        this.mittwoch = res.mittwoch;
        this.donnerstag = res.donnerstag;
        this.freitag = res.freitag;
        this.woche = res.woche;
      })
      .catch(err => { });
    this.user = null;
    this.httpgetService
      .getSchuelers()
      .then(res => {
        this.schuelers = res;
      })
      .catch(err => { });
    setInterval(() => {
      this.httpgetService
        .getSchuelers()
        .then(res => {
          this.schuelers = res;
        })
        .catch(err => { });
    }, 10000);
  }

  edit(name: string) {
    for (let i = 0; i < this.schuelers.length; i++) {
      if (name === this.schuelers[i].name) {
        this.user = this.schuelers[i].name;
        this.class = this.schuelers[i].klasse;
        this.dmo = this.schuelers[i].mo;
        this.ddi = this.schuelers[i].di;
        this.dmi = this.schuelers[i].mi;
        this.ddo = this.schuelers[i].do;
        this.dfr = this.schuelers[i].fr;
      }
    }
  }

  delete(name: string) {
    const confirm = window.confirm('Willst du den Eintrag wirklich löschen?');
    if (confirm) {
      for (let i = 0; i < this.schuelers.length; i++) {
        if (name === this.schuelers[i].name) {
          this.schuelers.splice(i, 1);
          this.httpputService
            .putSchuelers(this.schuelers)
            .then(res => {
              this.schuelers = res;
            })
            .catch(err => { });
          return;
        }
      }
    }
  }

  save(value: itf.Schueler) {
    if (this.nameValid.isOpen()) {
      this.nameValid.close();
    }
    if (this.classValid.isOpen()) {
      this.classValid.close();
    }
    if (value.name === null || value.name === '' || value.name === undefined) {
      this.nameValid.open();
      return;
    }
    if (value.klasse === null || value.klasse === '' || value.klasse === undefined) {
      this.classValid.open();
      return;
    }
    if (this.dmo === false && this.ddi === false && this.dmi === false && this.ddo === false && this.dfr === false) {
      return;
    }
    for (let i = 0; i < this.schuelers.length; i++) {
      if (value.name === this.schuelers[i].name) {
        this.schuelers[i].mo = value.mo;
        this.schuelers[i].di = value.di;
        this.schuelers[i].mi = value.mi;
        this.schuelers[i].do = value.do;
        this.schuelers[i].fr = value.fr;
        this.httpputService
          .putSchuelers(this.schuelers)
          .then(res => {
            this.schuelers = res;
          })
          .catch(err => { });
        this.user = null;
        this.class = null;
        this.dmo = false;
        this.ddi = false;
        this.dmi = false;
        this.ddo = false;
        this.dfr = false;
        return;
      }
    }
    this.schuelers.push(value);
    this.user = null;
    this.class = null;
    this.dmo = false;
    this.ddi = false;
    this.dmi = false;
    this.ddo = false;
    this.dfr = false;
    this.httpputService
      .putSchuelers(this.schuelers)
      .then(res => {
        this.schuelers = res;
      })
      .catch(err => { });
  }
}
