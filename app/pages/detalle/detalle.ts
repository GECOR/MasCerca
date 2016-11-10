import {Component} from '@angular/core';
import {NavController, NavParams, Alert, Storage, SqlStorage} from 'ionic-angular';
import {IncidenciaPage} from '../incidencia/incidencia';
import {Usuario} from './detalleInterface';
import {CargaCuadrante} from './../semanal/semanalInterface'
import {detalleService} from './detalleService'
import {Auxiliar} from './../login/loginInterface';
import {GeolocationProvider} from './../../providers/geolocation';

@Component({
  templateUrl: 'build/pages/detalle/detalle.html',
  providers: [ detalleService, GeolocationProvider ]
})
export class detallePage {
    item: any;
    boolEntra = false;
    tituloBtn = "Entrar";
    listTask = [];
    boolEIC = false;
    cargaCuadrante: CargaCuadrante;
    storage: any;
    auxiliar: Auxiliar;
    latLng: any;
    location: any;

     constructor(private params: NavParams
     , private navController: NavController
     , private detalleService: detalleService
     , private geo: GeolocationProvider){


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
        console.log(this.listTask);
        console.log(this.params.get('item'));
    }

    ionViewDidEnter(){
        this.storage = new Storage(SqlStorage);

        this.initGeolocation();

        this.storage.get('auxiliar').then((auxiliar) =>{
        if(auxiliar != "" && auxiliar != undefined){        
            this.auxiliar = JSON.parse(auxiliar.toString());
        }

        },
        error =>{
        console.log(error);
        });
    }

    switchEntra(){
        if(this.boolEntra){
            this.boolEntra = false;
            this.tituloBtn = "Entrar";
            this.enviarVisita("E");
        }else{
            this.boolEntra = true;
            this.tituloBtn = "Salir";
            this.enviarVisita("S");
        }

        console.log(this.boolEntra);
    };

    classEntra(){
        let classes = '';
        if(this.boolEntra){
            classes += ' secondary round';
        }else{
            classes += ' light round';
        }

        return classes;
    };

    enviarVisita(eos) {
        let DNIAuxiliar = this.auxiliar.DNIAuxiliar;
        let FechaVisita = this.getCurrentDateString();
        let EoS = eos;
        let Usuario_ID = this.cargaCuadrante.id_cliente;        
        let Latitud = this.latLng.lat();//"1";
        let Longitud = this.latLng.lng(); //"1";
        this.detalleService.nuevaVisita(DNIAuxiliar, FechaVisita, EoS, Usuario_ID, Latitud, Longitud).subscribe((VisitaID_inserted) =>{
                                  if(VisitaID_inserted.VisitaID =! 0){
                                    this.showAlert("Atencion!", "Visita enviada correctamente", "Aceptar");
                                  }else{
                                    this.showAlert("Error!", "Incidencia no enviada", "Aceptar");
                                  }
                                },
                                error => {
                                    this.showAlert("Error", "Incidencia no enviada", "Aceptar");
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
    let alert = Alert.create({
      title: 'Atención!',
      subTitle: 'Material necesario:',
      message: '- Guantes dobles <br> - Mascarilla',
      buttons: ['OK']
    });
    this.navController.present(alert);
  };

  showAlert(title, subTitle, okButton){
    let alert = Alert.create({
      title: title,
      subTitle: subTitle,
      buttons: [okButton]
    });
    this.navController.present(alert);
  }
}