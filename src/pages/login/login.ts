import { Component, forwardRef, NgZone } from '@angular/core';
import { NavController, AlertController, Platform, LoadingController } from 'ionic-angular';
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
    , private loginService: LoginService
    , public loadingCtrl: LoadingController) {

      
    }

    loginAuxiliar() {

      let loading = this.loadingCtrl.create({
        content: 'Entrando...'
      });

      loading.onDidDismiss((auxiliar) => {
        console.log(auxiliar);
        if(auxiliar == null){
          this.showAlert("Error", "No existe el usuario", "Aceptar");
        }else{
          this.auxiliar = auxiliar;
          this.comprobarAuxiliar();
        }
        
      });

      loading.present();

      this.loginService.loginAuxiliar(this.dni.trim())
                      .subscribe(
                          (auxiliar) =>{
                            loading.dismiss(auxiliar);    
                          },
                          error => {
                            loading.dismiss(null);                             
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
