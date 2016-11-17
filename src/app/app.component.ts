import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen, Push } from 'ionic-native';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { appService } from './app.service';
import { Auxiliar } from '../pages/login/loginInterface';


@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`,
  providers: [Storage, appService]
})
export class MyApp {
  rootPage: any;
  push: any;
  auxiliar: Auxiliar;

  constructor(platform: Platform
              , public storage: Storage
              , private appService: appService) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      //Splashscreen.hide();
      this.iniciarApp();      
    });

  }

  iniciarApp(){

    this.storage.get('auxiliar')
      .then(
        (auxiliar) => {
          if(auxiliar != "" && auxiliar != undefined){        
            this.auxiliar = JSON.parse(auxiliar.toString());
          }

          this.storage.get('firstRun')
          .then(
            (resp) =>{
              if(this.auxiliar)
                this.rootPage = TabsPage;
              else if(resp != "" && auxiliar != undefined)
                this.rootPage = LoginPage;
              else
                this.rootPage = LoginPage;
            },
            error => console.error(error)
          );
          this.initializePush();
          Splashscreen.hide(); 
        },
        error => console.error(error)
      );

  }

  initializePush(){
    this.push = Push.init({
            android: {
              senderID: "1060313159714"
            },
            ios: {
              alert: "true",
              badge: true,
              sound: 'false'
            },
            windows: {}
          });
          this.push.on('registration', (data) => {
            //console.log("DeviceToken-> "+data.registrationId);
            this.storage.set('DeviceToken', data.registrationId);
            if(this.auxiliar){
              
              this.appService.registerDeviceToken({
                'DeviceToken': data.registrationId,
                'DNIAuxiliar': this.auxiliar.DNIAuxiliar
              })
                .subscribe((res) => {
                  console.log(res); 
                },
                error => {
                    //this.showAlert("Error", "No existen mensajes", "Aceptar");
                    console.log(error);
                });
            }

          });
          this.push.on('notification', (data) => {
            console.log(data);       

            this.push.setApplicationIconBadgeNumber(function() {
              console.log('success');
            }, function() {
              console.log('error');
            }, data.count);
            
            /*
            if (!data.additionalData.foreground){
              this.events.publish('tab:inc');
              this.storage.set('incFromPush',  JSON.stringify({"id": data.additionalData.id, "time": data.additionalData.time}))
              setTimeout(() =>
                this.events.publish('newPush')
              , 100);              
            }
            */

          });
          this.push.on('error', (e) => {
            console.log(e.message);
          });
  }

}
