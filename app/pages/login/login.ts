import {Component, forwardRef, NgZone} from '@angular/core';
import {NavController, Alert, Platform, Storage, SqlStorage} from 'ionic-angular';
import {TabsPage} from './../tabs/tabs';
import {LoginService} from './loginService';
import {Auxiliar} from './loginInterface';

@Component({
  templateUrl: './build/pages/login/login.html',
  providers: [ LoginService ],
})
export class LoginPage {

  alert: any;
  viewInScreen: boolean;
  storage: any;
  dni: string = "";
  auxiliar: Auxiliar;
    
    constructor(private nav: NavController
    , private platform: Platform
    , private loginService: LoginService) {

      /*platform.registerBackButtonAction((event) => {
          if(this.viewInScreen){
            this.backButtonAction();
          }else{
            this.nav.pop();
          }   
        }, 100);*/

        this.storage = new Storage(SqlStorage);
    }

    loginAuxiliar() {         
      //this.nav.present(this.loadingComponent);
      //this.loginLoading = true;
      this.loginService.loginAuxiliar(this.dni.trim())
                      .subscribe(
                          (auxiliar) =>{                                    
                              this.auxiliar = auxiliar;
                              this.comprobarAuxiliar();
                          },
                          error => {
                              this.showAlert("Error", "No existe el usuario", "Aceptar");
                              //this.errorMessage = <any>error;
                              //this.loadingComponent.dismiss();
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
      let alert = Alert.create({
        title: title,
        subTitle: subTitle,
        buttons: [okButton]
      });
      this.nav.present(alert);
    }

  backButtonAction(){
      if(this.alert == undefined){
        this.alert = Alert.create({
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
              //this.nav.push(Inicio);
              this.alert = undefined;
              this.platform.exitApp();
            }
          }
        ]
      });
      this.nav.present(this.alert);
      }
    }

    getpruebaHello() {         
      //this.nav.present(this.loadingComponent);
      //this.loginLoading = true;
      this.loginService.getContentLengthFromUrl('http://localhost/MasCercaAPI1/api/CargaCuadrante/pruebaHello');
      this.loginService.getpruebaHello();
        
    }
}
