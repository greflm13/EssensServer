import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import * as itf from './schueler';

@Injectable()
export class HttpputService {
  private api = '/api/putMeHere?q=';
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

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
