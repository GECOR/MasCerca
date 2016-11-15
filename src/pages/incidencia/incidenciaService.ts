import {Injectable} from '@angular/core';
import {urlGecorApi} from './../../app/appConfig';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Usuario} from './../detalle/detalleInterface'; 
import {Tipo} from './../incidencia/incidenciaInterface'; 
import 'rxjs/Rx';

@Injectable()
export class incidenciaService {
    constructor (private http: Http) {}
    
    getUsuariosFromAux(codAux: string): Observable<Array<Usuario>> {
        
        let body = JSON.stringify({ codAux });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        
        return this.http.post(urlGecorApi + 'Usuarios/getUsuariosFromAux', body, options) //urlGecorApi + 'Auxiliares/loginAuxiliar'
                        .map(res => <Array<Usuario>> res.json())
                        .do(res => <Array<Usuario>> res) // eyeball results in the console
                        .catch(this.handleError)
                    
    }

    getTipos(codAux: string): Observable<Array<Tipo>> {
        
        let body = JSON.stringify({ codAux });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        
        return this.http.post(urlGecorApi + 'Tipos/getTipos', body, options) //urlGecorApi + 'Auxiliares/loginAuxiliar'
                        .map(res => <Array<Tipo>> res.json())
                        .do(res => <Array<Tipo>> res) // eyeball results in the console
                        .catch(this.handleError)
                    
    }

    nuevaIncidencia(DNIAuxiliar: string, Auxiliar: string, Fecha_Incidencia: string, Hora_Incidencia: string, Usuario_ID: string, Usuario: string, MotivoIncidencia: string, Observaciones: string): Observable<any> {
        
        let body = JSON.stringify({ DNIAuxiliar, Auxiliar, Fecha_Incidencia, Hora_Incidencia, Usuario_ID, Usuario, MotivoIncidencia, Observaciones });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        
        return this.http.post(urlGecorApi + 'Incidencia/nuevaIncidencia', body, options) //urlGecorApi + 'Auxiliares/loginAuxiliar'
                        .map(res => <any> res.json())
                        .do(res => <any> res) // eyeball results in the console
                        .catch(this.handleError)
                    
    }

    guardarFotoBase64(DNIAuxiliar: string, byteFoto: string, RegIncPressSAD_ID: string): Observable<any> {
        
        let body = JSON.stringify({ DNIAuxiliar, byteFoto, RegIncPressSAD_ID });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        
        return this.http.post(urlGecorApi + 'Incidencia/guardarFotoBase64', body, options) //urlGecorApi + 'Auxiliares/loginAuxiliar'
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