import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Leaderboard } from './minesweeper/field';

import * as itf from './schueler';

@Injectable()
export class HttpgetService {
  private api = '/api/callMeMaybe/';

  constructor(private http: Http) {}

  getSchuelers(): Promise<itf.Schueler[]> {
    return this.http
      .get(this.api + 'schuelers')
      .toPromise()
      .then(response => response.json() as itf.Schueler[])
      .catch(this.handleError);
  }

  getEssen(): Promise<itf.Essen> {
    return this.http
      .get(this.api + 'essen')
      .toPromise()
      .then(response => response.json() as itf.Essen)
      .catch(this.handleError);
  }

  getLast(): Promise<itf.Schueler[]> {
    return this.http
      .get(this.api + 'last')
      .toPromise()
      .then(response => response.json() as itf.Schueler[])
      .catch(this.handleError);
  }

  getLastEssen(): Promise<itf.Essen> {
    return this.http
      .get(this.api + 'lastessen')
      .toPromise()
      .then(response => response.json() as itf.Essen)
      .catch(this.handleError);
  }

  getLock(): Promise<itf.Lock> {
    return this.http
      .get(this.api + 'lockstate')
      .toPromise()
      .then(response => response.json() as itf.Lock)
      .catch(this.handleError);
  }

  getLeaderboard(): Promise<Leaderboard> {
    return this.http
      .get('/leaderboard')
      .toPromise()
      .then(response => response.json() as Leaderboard)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('Server not rechable. ERROR: ' + error);
    return Promise.reject(error.message || error);
  }
}
