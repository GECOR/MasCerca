import {Injectable} from '@angular/core';
import {urlGecorApi} from './../../app/appConfig';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Subject, BehaviorSubject, Observable, ConnectableObservable} from 'rxjs';
import {messageChat} from './chatInterface'; 
import * as io from "socket.io-client";

@Injectable()
export class chatService {
    /*
    socket: SocketIOClient.Socket;
    private userIsWriting: boolean = false;

    newMessage: Subject<MessageChat> = new BehaviorSubject<MessageChat>(null);
    newMessageFromNotifications: Subject<MessageChat> = new BehaviorSubject<MessageChat>(null);
    receivedMessage: Subject<MessageChat> = new Subject<MessageChat>();
    writer: Subject<Writer> = new Subject<Writer>();
    */

    constructor (private http: Http) {}

    nuevoMessage(dateMessage: string, message: string, sendedByAux_ID: string, sendedByName: string, sendedByMe: string): Observable<Array<Object>> {
        
        let body = JSON.stringify({ dateMessage, message, sendedByAux_ID, sendedByName, sendedByMe });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        
        return this.http.post(urlGecorApi + 'Messages/nuevoMessage', body, options) //urlGecorApi + 'Auxiliares/loginAuxiliar'
                        .map(res => <any> res.json())
                        .do(res => <any> res) // eyeball results in the console
                        .catch(this.handleError)
                    
    }

    guardarFotoBase64(DNIAuxiliar: string, byteFoto: string, RegIncPressSAD_ID: string): Observable<Array<Object>> {
        
        let body = JSON.stringify({ DNIAuxiliar, byteFoto, RegIncPressSAD_ID });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        
        return this.http.post(urlGecorApi + 'Messages/guardarFotoBase64', body, options) //urlGecorApi + 'Auxiliares/loginAuxiliar'
                        .map(res => <any> res.json())
                        .do(res => <any> res) // eyeball results in the console
                        .catch(this.handleError)
                    
    }
    
    getMessagesFromAux(codAux: string): Observable<Array<messageChat>> {
        
        let body = JSON.stringify({ codAux });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        
        return this.http.post(urlGecorApi + 'Messages/getMessagesFromAux', body, options) //urlGecorApi + 'Auxiliares/loginAuxiliar'
                        .map(res => <Array<messageChat>> res.json())
                        .do(res => <Array<messageChat>> res) // eyeball results in the console
                        .catch(this.handleError)
                    
    }

    private handleError (error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
  }
}