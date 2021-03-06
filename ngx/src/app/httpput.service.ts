import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { People, Leaderboard } from './minesweeper/field';

import * as itf from './schueler';

@Injectable()
export class HttpputService {
  private api = '/api/putMeHere/';
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private http: Http) {}

  putSchuelers(Schuelers): Promise<itf.Schueler[]> {
    return this.http
      .post(this.api + 'schuelers', JSON.stringify(Schuelers), {
        headers: this.headers
      })
      .toPromise()
      .then(res => res.json() as itf.Schueler[])
      .catch(this.handleError);
  }

  putEssen(value: itf.Essen): Promise<Object> {
    return this.http
      .post('/essen', JSON.stringify(value), {
        headers: this.headers
      })
      .toPromise()
      .then()
      .catch(this.handleError);
  }

  putLeaderboard(leaderboard: Leaderboard): Promise<Leaderboard> {
    return this.http
      .post('/leaderboard', JSON.stringify(leaderboard), {
        headers: this.headers
      })
      .toPromise()
      .then(res => res.json() as Leaderboard)
      .catch(this.handleError);
  }

  putLock(lock: boolean): Promise<Lo> {
    const Lock = { lock: lock };
    return this.http
      .post('/lock', JSON.stringify(Lock), {
        headers: this.headers
      })
      .toPromise()
      .then(res => res.json() as Lo)
      .catch(this.handleError);
  }

  putDelete(): Promise<boolean> {
    return this.http
      .post('/delete', {
        headers: this.headers
      })
      .toPromise()
      .then()
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    window.alert('Server nicht erreichbar.');
    return Promise.reject(error.message || error);
  }
}

interface Lo {
  lock: boolean;
}
