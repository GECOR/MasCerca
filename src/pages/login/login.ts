import { Component, forwardRef, NgZone } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
//import { NativeStorage } from 'ionic-native';
import { Storage } from '@ionic/storage';
import { TabsPage } from './../tabs/tabs';
import { LoginService } from './loginService';
import { Auxiliar } from './loginInterface';

@Component({
  templateUrl: 'login.html',
  providers: [ LoginService, Storage ],
})
export class LoginPage {
  password: string;
  alert: any;
  viewInScreen: boolean;
  dni: string = "";
  auxiliar: Auxiliar;
    
    constructor(private nav: NavController
    , private platform: Platform
    , public alertCtrl: AlertController
    , public storage: Storage
    , private loginService: LoginService) {

      
    }

    loginAuxiliar() {         
      this.loginService.loginAuxiliar(this.dni.trim())
                      .subscribe(
                          (auxiliar) =>{                                    
                              this.auxiliar = auxiliar;
                              this.comprobarAuxiliar();
                          },
                          error => {
                              this.showAlert("Error", "No existe el usuario", "Aceptar");
                          });
        
    }

    comprobarAuxiliar(){
      if(this.auxiliar != null){
        if(this.auxiliar.DNIAuxiliar == this.dni.trim()){
          this.storage.set('auxiliar', JSON.stringify(this.auxiliar));
          this.openMainPage();
        }else{
          this.showAlert("Alerta", "usuario no registrado", "Aceptar");
        }  
      }else{
        this.showAlert("Alerta", "usuario no registrado", "Aceptar");
      }
    }

    openMainPage() {
      this.nav.push(TabsPage);
    }
    
    showAlert(title, subTitle, okButton){
      let alert = this.alertCtrl.create({
        title: title,
        subTitle: subTitle,
        buttons: [okButton]
      });
      alert.present();
    }

  backButtonAction(){
      if(this.alert == undefined){
        this.alert = this.alertCtrl.create({
        title: 'Atención',
        message: '¿Desea salir de la aplicación?',
        buttons: [
          {
            text: 'NO',
            role: 'cancel',
            handler: () => {
              //Do nothing
              this.alert = undefined;
            }
          },
          {
            text: 'SI',
            handler: () => {
              this.alert = undefined;
              this.platform.exitApp();
            }
          }
        ]
      });
      this.alert.present();
      }
    }

    getpruebaHello() {         
      this.loginService.getContentLengthFromUrl('http://localhost/MasCercaAPI1/api/CargaCuadrante/pruebaHello');
      this.loginService.getpruebaHello();
        
    }
}
