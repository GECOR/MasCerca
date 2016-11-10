import {Injectable} from '@angular/core';
import {urlGecorApi} from './../../appConfig';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Auxiliar} from './loginInterface'; 
import 'rxjs/Rx';

@Injectable()
export class LoginService {
    constructor (private http: Http) {}
    
    loginAuxiliar(codAux: string): Observable<Auxiliar> {
        
        let body = JSON.stringify({ codAux });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        
        return this.http.post(urlGecorApi + 'Auxiliares/loginAuxiliar', body, options) 
                        .map(res => <Auxiliar> res.json())
                        .do(res => <Auxiliar> res) // eyeball results in the console
                        .catch(this.handleError)
                    
    }

    /*loginAuxiliar(codAux: string): Observable<any> {
        
        let body = JSON.stringify({ codAux });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        
        return this.http.post('http://localhost/MasCercaAPI1/api/Auxiliares/loginAuxiliar', body, options)
                        .map(res => <any> res.json())
                        //.do() // eyeball results in the console
                        .catch(this.handleError)
                    
    }*/

    getContentLengthFromUrl(url: string): Observable<any> {
        
        return this.http.get(url)
                        .map(this.extractData)
                        .catch(this.handleError);
                    
    }

    extractData(res: Response){
        console.log(res);
    }

    getpruebaHello() {
        this.http.get(urlGecorApi + 'CargaCuadrante/pruebaHello')
            .map(res => res.text())
            .subscribe(
            res => this.extractData,
            err => this.handleError(err),
            () => console.log('Random Quote Complete')
            );
    }

    private handleError (error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
  }
}