import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpgetService } from '../httpget.service';
import { HttpputService } from '../httpput.service';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import * as itf from '../schueler';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {
  public schuelers: itf.Schueler[];
  public lock: boolean;
  public user: string;
  public class: string;
  public dmo = false;
  public ddi = false;
  public dmi = false;
  public ddo = false;
  public dfr = false;
  public montag: string;
  public dienstag: string;
  public mittwoch: string;
  public donnerstag: string;
  public freitag: string;
  public woche: string;
  public tuttifrutti = false;
  public tuttifruttibild: string;
  public tuttifruttiabstand = '1000px';
  private tuttifruttizaehler: number;
  private tuttifruttizahl = 1;
  private tuttifruttiinterval;
  private Tuba = new Audio();
  private interval;

  @ViewChild('nameValid') public nameValid: NgbPopover;
  @ViewChild('classValid') public classValid: NgbPopover;

  constructor(private httpgetService: HttpgetService, private httpputService: HttpputService) { }

  ngOnInit() {
    this.Tuba.src = '/assets/tuba.mp3';
    this.Tuba.loop;
    this.tuttifruttizaehler = window.screen.width;
    this.httpgetService
      .getLock()
      .then(res => {
        this.lock = res.lock;
      })
      .catch(err => { });
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
        this.sorting();
      })
      .catch(err => { });
    this.interval = setInterval(() => {
      this.httpgetService
        .getSchuelers()
        .then(res => {
          this.schuelers = res;
          this.sorting();
        })
        .catch(err => { });
    }, 10000);
  }

  sorting() {
    this.schuelers.sort((leftSide, rightSide): number => {
      if (leftSide.klasse < rightSide.klasse) {
        return -1;
      }
      if (leftSide.klasse > rightSide.klasse) {
        return 1;
      }
      return 0;
    });
  }

  ngOnDestroy() {
    clearInterval(this.interval);
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

  delete(name: string) {
    const confirm = window.confirm('Willst du den Eintrag "' + name + '" wirklich löschen?');
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

  classe(string: string) {
    this.class = string;
    setTimeout(() => {
      if (this.nameValid.isOpen()) {
        this.nameValid.close();
      }
    }, 1);
  }

  close() {
    if (this.classValid.isOpen()) {
      this.classValid.close();
    }
    if (this.nameValid.isOpen()) {
      this.nameValid.close();
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
      if (value.name === this.schuelers[i].name && value.klasse === this.schuelers[i].klasse) {
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

    // tslint:disable-next-line:max-line-length
    if ((this.user === 'TUTTNER HUNGRIG' || this.user === 'Tuttner Hungrig' || this.user === 'Tuttner hungrig' || this.user === 'tuttner hungrig' || this.user === 'tuttner Hungrig') && this.class === '1AHME' && this.dmo === true && this.ddi === true && this.dmi === true && this.ddo === true && this.dfr === true) {
      this.tuttifrutti = true;
      this.Tuba.load();
      this.Tuba.play();
      this.tuttifruttiinterval = setInterval(() => {
        if (this.tuttifruttizahl !== 4) {
          this.tuttifruttizahl++;
        } else {
          this.tuttifruttizahl = 1;
        }
        switch (this.tuttifruttizahl) {
          case 1:
            this.tuttifruttibild = '1.png';
            break;
          case 2:
            this.tuttifruttibild = '2.png';
            break;
          case 3:
            this.tuttifruttibild = '3.png';
            break;
          case 4:
            this.tuttifruttibild = '4.png';
            break;
        }
        this.tuttifruttizaehler = this.tuttifruttizaehler - 20;
        this.tuttifruttiabstand = this.tuttifruttizaehler + 'px';
        if (this.tuttifruttizaehler === -160) {
          this.tuttifruttizaehler = window.screen.width;
          clearInterval(this.tuttifruttiinterval);
          this.tuttifrutti = false;
          this.Tuba.pause();
        }
      }, 500);
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
