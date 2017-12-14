import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import * as itf from './schueler';

@Injectable()
export class HttpgetService {

  private api = '/api/callMeMaybe?q=';

  constructor(private http: Http) { }

  getSchuelers(): Promise<itf.Schueler[]> {
    return this.http.get(this.api + 'schuelers')
      .toPromise()
      .then(response => response.json() as itf.Schueler[])
      .catch(this.handleError);
  }

  getEssen(): Promise<itf.Essen> {
    return this.http.get(this.api + 'essen')
      .toPromise()
      .then(response => response.json() as itf.Essen)
      .catch(this.handleError);
  }

  getLast(): Promise<itf.Schueler[]> {
    return this.http.get(this.api + 'last')
      .toPromise()
      .then(response => response.json() as itf.Schueler[])
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
