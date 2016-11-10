import {Component} from '@angular/core';
import {Platform, ionicBootstrap, Storage, SqlStorage} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {TabsPage} from './pages/tabs/tabs';
import {LoginPage} from './pages/login/login';
import {Splashscreen, Globalization, Push} from 'ionic-native';
import {Auxiliar} from './pages/login/loginInterface';


@Component({
  templateUrl: 'build/app.html',
})
export class MyApp {
  storage: any;
  auxiliar: Auxiliar;
  private rootPage:any;

  constructor(private platform:Platform) {
    //this.rootPage = TabsPage;

    //this.rootPage = LoginPage;

    platform.ready().then(() => {
      StatusBar.styleDefault();
      this.iniciarApp();
    });
  }

  iniciarApp(){
    this.storage = new Storage(SqlStorage);

    this.storage.get('auxiliar').then((auxiliar) =>{
    if(auxiliar != "" && auxiliar != undefined){        
      this.auxiliar = JSON.parse(auxiliar.toString());
    }

    this.storage.get('firstRun').then((resp) => {
      if(this.auxiliar)
        this.rootPage = TabsPage;
      else if(resp != "" && auxiliar != undefined)
        this.rootPage = LoginPage;
      else
        this.rootPage = LoginPage;
        //this.rootPage = SlidePage;
    });   
    Splashscreen.hide();                                                              
    },
    error =>{
      console.log(error);
    });
  }
}

ionicBootstrap(MyApp)
