import {Injectable} from '@angular/core';
import {urlGecorApi} from './../../appConfig';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class detalleService {
    constructor (private http: Http) {}

    nuevaVisita(DNIAuxiliar: string, FechaVisita: string, EoS: string, Usuario_ID: string, Latitud: string, Longitud: string): Observable<any> {
        
        let body = JSON.stringify({ DNIAuxiliar, FechaVisita, EoS, Usuario_ID, Latitud, Longitud });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        
        return this.http.post(urlGecorApi + 'Visitas/nuevaVisita', body, options) //urlGecorApi + 'Auxiliares/loginAuxiliar'
                        .map(res => <any> res.json())
                        .do(res => <any> res) // eyeball results in the console
                        .catch(this.handleError)
                    
    }

    private handleError (error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
  }
}