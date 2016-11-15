import {Injectable} from '@angular/core';
import {urlGecorApi} from './../../app/appConfig';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {CargaCuadrante} from './semanalInterface'; 
import 'rxjs/Rx';

@Injectable()
export class semanalService {
    constructor (private http: Http) {}
    
    getCargaCuadrante(codAux: string, diasemana: string): Observable<Array<CargaCuadrante>> {
        
        let body = JSON.stringify({ codAux, diasemana });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        
        return this.http.post(urlGecorApi + 'CargaCuadrante/getCargaCuadrante', body, options) //urlGecorApi + 'Auxiliares/loginAuxiliar'
                        .map(res => <Array<CargaCuadrante>> res.json())
                        .do(res => <Array<CargaCuadrante>> res) // eyeball results in the console
                        .catch(this.handleError)
                    
    }

    private handleError (error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
  }
}