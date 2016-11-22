import {Component} from '@angular/core';
import {NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
//import { NativeStorage } from 'ionic-native';
import { Storage } from '@ionic/storage';
import {IncidenciaPage} from '../incidencia/incidencia';
import {Usuario} from './detalleInterface';
import {CargaCuadrante} from './../semanal/semanalInterface'
import {detalleService} from './detalleService'
import {Auxiliar} from './../login/loginInterface';
import {GeolocationProvider} from './../../providers/geolocation';

@Component({
  templateUrl: 'detalle.html',
  providers: [ detalleService, GeolocationProvider, Storage ]
})
export class detallePage {
    item: any;
    boolEntra = true;
    listTask = [];
    boolEIC = false;
    cargaCuadrante: CargaCuadrante;
    //storage: any;
    auxiliar: Auxiliar;
    latLng: any;
    location: any;

     constructor(private params: NavParams
     , private navController: NavController
     , public alertCtrl: AlertController
     , public storage: Storage
     , private detalleService: detalleService
     , private geo: GeolocationProvider
     , public loadingCtrl: LoadingController){


        // userParams is an object we have in our nav-parameters
        this.cargaCuadrante = this.params.get('item');
        if(this.cargaCuadrante.subcategoria.indexOf(",")){
            this.listTask = this.cargaCuadrante.subcategoria.split(",");
        }else{
            this.listTask[0] = this.cargaCuadrante.subcategoria;
        }
        //this.listTask = this.item.Task.split(",");
        /*if(this.item.EIC == 0){
            this.boolEIC = false;
        }else if(this.item.EIC == 1){
            this.boolEIC = true;
        }*/
        //console.log(this.listTask);
        //console.log(this.params.get('item'));

        this.storage.get('auxiliar').then((auxiliar) =>{
            console.log(JSON.parse(auxiliar.toString()));
            if(auxiliar != "" && auxiliar != undefined){        
                this.auxiliar = JSON.parse(auxiliar.toString());
                if (this.auxiliar.UltimaVisita != undefined){
                    if (this.auxiliar.UltimaVisita.Usuario_ID == this.cargaCuadrante.id_cliente && this.auxiliar.UltimaVisita.EoS == "E"){
                        this.boolEntra = false;
                    }
                }
            }
        },
        error =>{
        console.log(error);
        });
    }

    ionViewDidEnter(){
        this.initGeolocation();        
    }

    switchEntra(eos){
        this.boolEntra = !eos;
        if(eos){
            this.enviarVisita("E");
        }else{
            this.enviarVisita("S");
        }
    };

    /*classEntra(){
        let classes = '';
        if(this.boolEntra){
            classes += ' secondary round';
        }else{
            classes += ' light round';
        }

        return classes;
    };*/

    enviarVisita(eos) {

        let DNIAuxiliar = this.auxiliar.DNIAuxiliar;
        let FechaVisita = this.getCurrentDateString();
        let EoS = eos;
        let Usuario_ID = this.cargaCuadrante.id_cliente;        
        let Latitud = this.latLng == undefined ? 0 : this.latLng.lat();//"1";
        let Longitud = this.latLng == undefined ? 0 : this.latLng.lng();//"1";

        let loading = this.loadingCtrl.create({
            content: 'Enviando visita...'
        });

        loading.onDidDismiss((VisitaID_inserted) => {
            console.log(VisitaID_inserted);
            if(VisitaID_inserted == null){
                this.showAlert("Error", "Visita no enviada", "Aceptar");
            }else{
                if(VisitaID_inserted.VisitaID =! 0){
                    this.auxiliar.UltimaVisita = {
                        VisitaID: VisitaID_inserted[0].ID,
                        EoS: eos,
                        Usuario_ID: Usuario_ID
                    };
                    console.log(this.auxiliar);
                    this.storage.set('auxiliar', JSON.stringify(this.auxiliar));
                    this.showAlert("Atencion!", "Visita enviada correctamente", "Aceptar");
                }else{
                    this.showAlert("Error!", "Visita no enviada", "Aceptar");
                }
            }        
        });

        loading.present();
        
        this.detalleService.nuevaVisita(DNIAuxiliar, FechaVisita, EoS, Usuario_ID, Latitud, Longitud).subscribe((VisitaID_inserted) =>{
            loading.dismiss(VisitaID_inserted);
        },
        error => {
            loading.dismiss(null);
        });
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

    initGeolocation(){
        this.geo.getLocation().then(location =>{
        this.location = location;
        if (this.location.error){
          this.latLng = new google.maps.LatLng(0, 0);
        }else{        
          this.latLng = this.location.latLng;
        }
      });  
    }

    itemTapped(item) {
        this.navController.push(IncidenciaPage, {
            item: item
        });
    }

    doAlert() {
    let alert = this.alertCtrl.create({
      title: 'Atención!',
      subTitle: 'Material necesario:',
      message: '- Guantes dobles <br> - Mascarilla',
      buttons: ['OK']
    });
    alert.present();
  };

  showAlert(title, subTitle, okButton){
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: [okButton]
    });
    alert.present();
  }
}