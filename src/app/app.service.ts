import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Subject, BehaviorSubject, Observable, ConnectableObservable } from 'rxjs';
import { urlGecorApi } from './appConfig';

@Injectable()
export class appService {
    constructor (private http: Http) {}

    registerDeviceToken(deviceTokenObj: any): Observable<Object> {
        
        let body = JSON.stringify(deviceTokenObj);        
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        
        return this.http.post(urlGecorApi + 'Auxiliares/updateDeviceToken', body, options) 
                        .map(res => <any> res.json())
                        .do(res =>  <any> res) // eyeball results in the console
                        .catch(this.handleError)
    }

    private handleError (error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
  }
}