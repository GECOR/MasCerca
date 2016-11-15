import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';

import {Auxiliar} from '../pages/login/loginInterface';


@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`,
  providers: [Storage]
})
export class MyApp {
  rootPage: any;

  auxiliar: Auxiliar;

  constructor(platform: Platform, public storage: Storage) {
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

          Splashscreen.hide(); 
        },
        error => console.error(error)
      );

  }

}
