import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, Storage, SqlStorage, Alert} from 'ionic-angular';
import {NgClass} from '@angular/common';
import {UtilsProvider} from './../../providers/utils';
import {messageChat} from './chatInterface';
import {Auxiliar} from './../login/loginInterface';
import {chatService} from './chatService';

//declare var io;
import * as io from "socket.io-client";

@Component({
  templateUrl: 'build/pages/chat/chat.html',
  providers: [UtilsProvider, chatService]
})
export class chatPage {
  //socket: any;
  socket: SocketIOClient.Socket;
  messagesChat = [];
  textImput = "";
  storage: any;
  auxiliar: Auxiliar;
  messageChat: messageChat;
  arrayMessageChat: Array<messageChat>;

  @ViewChild('chatContent') content;

  constructor(private params: NavParams
  , private navController: NavController
  , private utils: UtilsProvider
  , private chatService: chatService){

    this.socketJoin();

    this.messageChat = {
        messageChat_ID: undefined,
        dateMessage: undefined,
        message: undefined,
        sendedByAux_ID: undefined,
        m_checked: undefined,
        info: undefined,
        sendedByName: undefined,
        sendedByMe: undefined
    }

    this.messagesChat = [
      {"name":"Usuario 1", "icon":"https://cdn.schd.ws/common/img/avatar-empty.png", "description":"Hola tengo un problema...", "isLocal":"1"},
      {"name":"Central", "icon":"https://cdn.schd.ws/common/img/avatar-empty.png", "description":"Cuentame! Estamos aquí para ayudarte!", "isLocal":"0"},
      {"name":"Usuario 1", "icon":"https://cdn.schd.ws/common/img/avatar-empty.png", "description":"La persona no estaba en la casa...", "isLocal":"1"}
    ];
  }

  ionViewDidEnter(){
    this.storage = new Storage(SqlStorage);

    this.storage.get('auxiliar').then((auxiliar) =>{
      if(auxiliar != "" && auxiliar != undefined){
        this.auxiliar = JSON.parse(auxiliar.toString());
        //this.auxNomCompleto = this.auxiliar.NomCompleto
        if(this.socket){
          this.socket.emit('JoinRoom', this.auxiliar.DNIAuxiliar, this.auxiliar.DNIAuxiliar);
        }
      
        this.chatService.getMessagesFromAux(this.auxiliar.DNIAuxiliar).subscribe((messageChat) =>{
                                  this.arrayMessageChat = messageChat;
                                  this.storage.set('messageChat', JSON.stringify(this.arrayMessageChat));
                                  this.scrollTo(); 
                                },
                                error => {
                                    this.showAlert("Error", "No existen mensajes", "Aceptar");
                                });

      }
    },
    error =>{
      console.log(error);
    });
  }

  classIcon(message){
    let classes = '';
    if(message.isLocal == 1){
        classes += 'item-right';
    }else{
        classes += 'item-left';
    }
    return classes;
  };

  addMessage(message){
    if(this.textImput != ""){
      this.storage.get('auxiliar').then((auxiliar) =>{
          if(auxiliar != "" && auxiliar != undefined){   
            this.auxiliar = JSON.parse(auxiliar.toString());

            
            //this.messageChat = messageChat("", "", "", "", "", "", "", "")
            this.messageChat.dateMessage = this.getCurrentDateString(); //yyyy.toString() + "/" + mm_str + "/" + dd_str + " " + hh.toString() + ":" + min.toString() + ":" + ss.toString() //"2016/10/24 00:00:00"
            this.messageChat.message = message;
            this.messageChat.sendedByAux_ID = this.auxiliar.DNIAuxiliar;
            this.messageChat.sendedByName = 'Usuario 1';
            this.messageChat.sendedByMe = 'True'
          
            this.chatService.nuevoMessage(this.messageChat.dateMessage, this.messageChat.message, this.auxiliar.DNIAuxiliar, this.messageChat.sendedByName, this.messageChat.sendedByMe).subscribe((res) =>{
                                      if(res[0] != "" && res != undefined){
                                          this.arrayMessageChat.push(this.messageChat)
                                      }
                                      this.storage.set('messageChat', JSON.stringify(this.arrayMessageChat));
                                      if(this.socket){
                                          //this.socket.emit('chat message', message);
                                          //this.socket.emit('chat message', this.messageChat);
                                          this.socket.emit('SendMessage', this.messageChat, this.auxiliar.DNIAuxiliar);
                                      }
                                      this.textImput = "";
                                      this.scrollTo();  
                                    },
                                    error => {
                                        this.showAlert("Error", "No existen mensajes", "Aceptar");
                                    });

          }
        },
        error =>{
          console.log(error);
        });
      }
    }

  /*addMessage(message){
    if(this.textImput != ""){
      this.messagesChat.push(
        {"name":"Usuario 1", "icon":"https://cdn.schd.ws/common/img/avatar-empty.png", "description":message, "isLocal":"1"}
      );
      if(this.socket){
          this.socket.emit('chat message', message);
       }
      this.textImput = "";
    }
  }*/

  //public socketJoin(idRoom, token): Boolean {//SERVER 2
  public socketJoin(): Boolean {//SERVER 2
     try {
       this.socket = io.connect('http://192.168.1.145:3000');
     } catch (error) {
       console.error("Error SocketJoin",error)
     } finally{
       if(this.socket){
          this.socket.on('connect', () => {
            //this.socket.emit('add_room', this.auxiliar.DNIAuxiliar, this.auxiliar.DNIAuxiliar);
          this.socket.on('NewMessage', (msg) => {

            /*this.messageChat.dateMessage = this.getCurrentDateString();
            this.messageChat.message = msg;
            this.messageChat.sendedByAux_ID = this.auxiliar.DNIAuxiliar;
            this.messageChat.sendedByName = 'Central';
            this.messageChat.sendedByMe = '0'
            this.arrayMessageChat.push(this.messageChat);*/


            /*this.messagesChat.push(
              {"name":"Central", "icon":"https://cdn.schd.ws/common/img/avatar-empty.png", "description":msg, "isLocal":"0"}
            );*/

            if(msg.sendedByMe == "False"){
              this.arrayMessageChat.push(msg);
              this.scrollTo(); 
            }
            console.log("authenticated");
          });

          
          //this.socket.emit('create', idRoom);
          //this.initUsersStreams();
          //this.initMessagesStreams();


          //this.initLoggedInUser();
        });
        return true;
       }else{
        return false;
       }       
     }
  }

  showAlert(title, subTitle, okButton){
      let alert = Alert.create({
        title: title,
        subTitle: subTitle,
        buttons: [okButton]
      });
      this.navController.present(alert);
  }

  getCurrentDateString(): string {
    let currentDateString;
    let currentDate = new Date();

    let yyyy = currentDate.getFullYear();
    let dd = currentDate.getDate();
    let dd_str;
    let mm = currentDate.getMonth()+1; //January is 0!
    let mm_str;
    let hh = currentDate.getHours();
    let min = currentDate.getMinutes();
    let ss = currentDate.getSeconds();

    if(dd < 10){
        dd_str = '0' + dd.toString();
    }else{
      dd_str = dd.toString();
    }
    if(mm < 10){
        mm_str = '0' + mm.toString();
    }else{
      mm_str = mm.toString();
    }

    currentDateString = yyyy.toString() + "/" + mm_str + "/" + dd_str + " " + hh.toString() + ":" + min.toString() + ":" + ss.toString() //"2016/10/24 00:00:00"

    return currentDateString;
  }

  scrollTo(): void {
     let dimensions = this.content.getContentDimensions();
      this.content.scrollTo(0, dimensions.scrollBottom, 0);
  }

}