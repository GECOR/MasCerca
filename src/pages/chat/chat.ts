import { Component, ViewChild } from '@angular/core';
import { NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { NgClass } from '@angular/common';
import { Observable } from 'rxjs';
import { UtilsProvider } from './../../providers/utils';
import { MessageChat } from './models';
import { Auxiliar } from './../login/loginInterface';
import { chatService } from './chatService';


@Component({
  templateUrl: 'chat.html',
  providers: [UtilsProvider, chatService, Storage]
})
export class chatPage {  
  messagesChat = [];
  textImput = "";
  auxiliar: Auxiliar;
  arrayMessageChat: Array<MessageChat>; //Observable<Array<MessageChat>>;//

  @ViewChild('chatContent') content;

  constructor(private params: NavParams
  , public alertCtrl: AlertController
  , public utils: UtilsProvider
  , public storage: Storage
  , private chatService: chatService
  , public loadingCtrl: LoadingController){}

  ionViewDidEnter(){

    let loading = this.loadingCtrl.create({
      content: 'Entrando...'
    });

    loading.onDidDismiss((messageChat) => {
      if (messageChat == null){
        this.showAlert("Error", "No existen mensajes", "Aceptar");
      }else{
        this.arrayMessageChat = messageChat;
        this.storage.set('messageChat', JSON.stringify(this.arrayMessageChat));
        this.scrollTo();
      }
      
    });

    loading.present();
    
    this.storage.get('auxiliar').then((auxiliar) =>{
      if(auxiliar != "" && auxiliar != undefined){
        this.auxiliar = JSON.parse(auxiliar.toString());
        
        this.chatService.joinRoom(this.auxiliar.DNIAuxiliar, this.auxiliar.DNIAuxiliar);

        //this.arrayMessageChat = this.chatService.getMessagesFromAux(this.auxiliar.DNIAuxiliar);
        //this.arrayMessageChat.combineLatest(this.chatService.newMessage.asObservable());
        //this.arrayMessageChat.subscribe((messages) =>{
          //console.log("NewData to this.arrayMessageChat");
          //console.log(messages);
        //})

        
        this.chatService.getMessagesFromAux(this.auxiliar.DNIAuxiliar).subscribe((messageChat) =>{
                                  this.arrayMessageChat = messageChat;
                                  this.storage.set('messageChat', this.arrayMessageChat);
                                  this.scrollTo(); 
                                  loading.dismiss(messageChat);
                                },
                                error => {
                                  loading.dismiss(null);                                  
                                });
                                

      }
    },
    error =>{
      console.log(error);
    });

    

    //EVENT MESSAGE FROM ROOM
    this.chatService.newMessage.subscribe( m => {
            if (m != null) {
                //m.isLoading = false;
                this.arrayMessageChat.push(m);

                setTimeout(() => {
                  this.scrollTo(); 
                });
            }
            }, (e) => console.log(e)
        );

  }

  ionViewWillLeave(){
    console.log("ionViewWillLeave CHAT");
    this.chatService.forceDisconnect(this.auxiliar.DNIAuxiliar);
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

  addMessage(msg){
    if(this.textImput != ""){
      this.storage.get('auxiliar').then((auxiliar) =>{
          if(auxiliar != "" && auxiliar != undefined){   
            this.auxiliar = JSON.parse(auxiliar.toString());

            let message = new MessageChat({
                sendedByAux_ID: this.auxiliar.DNIAuxiliar,         
                sendedByName: 'Usuario 1',
                dateMessage: this.getCurrentDateString(),
                sendedByMe: true,
                message: msg
            });

            this.chatService.nuevoMessage(message)
                .subscribe((res) => {
                  this.arrayMessageChat.push(message);
                  this.storage.set('messageChat', this.arrayMessageChat);
                  
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

  showAlert(title, subTitle, okButton){
      let alert = this.alertCtrl.create({
        title: title,
        subTitle: subTitle,
        buttons: [okButton]
      });
      alert.present();
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