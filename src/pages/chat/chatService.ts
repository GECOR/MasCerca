import {Injectable} from '@angular/core';
import {urlGecorApi, urlSocket} from './../../app/appConfig';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Subject, BehaviorSubject, Observable, ConnectableObservable} from 'rxjs';
//import {messageChat} from './chatInterface';
import {MessagingEvent} from './chat.messagingevent';
import {MessageChat, Writer} from './models'; 
import * as io from "socket.io-client";

@Injectable()
export class chatService {
    
    socket: SocketIOClient.Socket;
    private userIsWriting: boolean = false;

    newMessage: Subject<MessageChat> = new BehaviorSubject<MessageChat>(null);
    newMessageFromNotifications: Subject<MessageChat> = new BehaviorSubject<MessageChat>(null);
    receivedMessage: Subject<MessageChat> = new Subject<MessageChat>();    
    writer: Subject<Writer> = new Subject<Writer>();
    

    constructor (private http: Http) {
        //var io = require('socket.io-client');
        this.socket = io.connect(urlSocket);
        
        this.socket.on('connect', () => {
           console.log('Conectado al Socket'); 
        });
        
        this.socket.on('disconnect', () => {
           console.log('Desconectado del Socket'); 
        });
        
        this.socket.on(MessagingEvent[MessagingEvent.NewMessage], (msg) => {
            //this.newMessage.next(new MessageChat(JSON.parse(msg)));
            this.newMessage.next(new MessageChat(msg));
        });

        this.socket.on(MessagingEvent[MessagingEvent.NewMessageFromNotifications], (msg) => {
            //this.newMessage.next(new MessageChat(JSON.parse(msg)));
            this.newMessageFromNotifications.next(new MessageChat(msg));
        });

        this.socket.on(MessagingEvent[MessagingEvent.MessageReceived], (msgId) => {
            this.receivedMessage.next(msgId);
        });

        this.socket.on(MessagingEvent[MessagingEvent.UserTyping], (writer) => {
            writer.isWriting = true;
            this.writer.next(new Writer(writer));
        });

        this.socket.on(MessagingEvent[MessagingEvent.UserStoppedTyping], (writer) => {
            writer.isWriting = false;
            this.writer.next(new Writer(writer));
        });
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
    
    getMessagesFromAux(codAux: string): Observable<Array<MessageChat>> {
        
        let body = JSON.stringify({ codAux });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        
        return this.http.post(urlGecorApi + 'Messages/getMessagesFromAux', body, options) //urlGecorApi + 'Auxiliares/loginAuxiliar'
                        .map(res => <Array<MessageChat>> res.json())
                        //.do(res => <Array<MessageChat>> res) // eyeball results in the console
                        .catch(this.handleError)
                    
    }

     nuevoMessage(msg: MessageChat): Observable<MessageChat> {
        
        let body = JSON.stringify(msg);
        console.log("NUEVO MESSAGE: "+ body);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        
        return this.http.post(urlGecorApi + 'Messages/nuevoMessage', body, options) 
                        .map(res => {
                                res = res.json();
                                if(res[0] != "" && res != undefined){
                                    this.sendMessage(msg, msg.sendedByAux_ID);
                                   
                                    //return msg;
                                }
                            })
                        //.do(res =>  <any> res) // eyeball results in the console
                        .catch(this.handleError)
    }

    private handleError (error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
  }

//////////////////////////////////// END API SERVICE CALL ////////////////////////////////////

    joinRoom(oldRoom: string,actualRoom: string): void {
        console.log('connected to room', actualRoom);  
        this.socket.emit(MessagingEvent[MessagingEvent.JoinRoom], oldRoom, actualRoom);
    }

    forceDisconnect(room: string): void {        
        this.socket.emit(MessagingEvent[MessagingEvent.ForceDisconnect], room);
    }

    sendMessage(message: MessageChat, room: string): void {
        //let msg = JSON.stringify(message);
        this.socket.emit(MessagingEvent[MessagingEvent.SendMessage], message, room);
    }

    startTyping(room: string): void {
        if (this.userIsWriting === false) {
            this.userIsWriting = true;
            this.socket.emit(MessagingEvent[MessagingEvent.ImTyping], room);
        }
    }

    stopTyping(room: string): void {
        if (this.userIsWriting === true) {
            this.userIsWriting = false;
            this.socket.emit(MessagingEvent[MessagingEvent.IStoppedTyping], room);
        }
    }

}