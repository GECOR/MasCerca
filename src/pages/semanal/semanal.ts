import {Component} from '@angular/core';
import {NavController, AlertController, LoadingController } from 'ionic-angular';
//import { NativeStorage } from 'ionic-native';
import { Storage } from '@ionic/storage';
import {UtilsProvider} from './../../providers/utils';
import {semanalService} from './semanalService';
import {CargaCuadrante} from './semanalInterface';
import {Auxiliar} from './../login/loginInterface';
import {HoyPage} from '../hoy/hoy';

@Component({
  templateUrl: 'semanal.html',
  providers: [UtilsProvider, semanalService, Storage]
})
export class SemanalPage {
  
  alert: any;
  items = [];
  //storage: any;
  auxiliar: Auxiliar;
  cargaCuadrante: Array<CargaCuadrante>;
  arrayDias = [];
  public nota: string = undefined;

  constructor(private navController: NavController
  , public utils: UtilsProvider
  , public alertCtrl: AlertController
  , public storage: Storage
  , private semanalService: semanalService
  , public loadingCtrl: LoadingController) {

    this.cargaCuadrante = new Array

    let loading = this.loadingCtrl.create({
      content: 'Cargando cuadrante...'
    });

    loading.onDidDismiss((cargaCuadrante) => {
      
      console.log("CargaCuadrante");
      console.log(cargaCuadrante);

      if(cargaCuadrante == null){
        this.showAlert("Error", "No existe el usuario", "Aceptar");
      }else{
        
        if(cargaCuadrante[0].Nota)
          this.nota = cargaCuadrante[0].Notas;
        
        this.cargaCuadrante = cargaCuadrante;
        this.storage.set('cargaCuadrante', JSON.stringify(this.cargaCuadrante));
        this.generateArrayDiasOrder();

      }
      
    });

    setTimeout(()=>{
        loading.present();
    });

    this.storage.get('auxiliar').then((auxiliar) =>{
      if(auxiliar != "" && auxiliar != undefined){        
        this.auxiliar = JSON.parse(auxiliar.toString());
        this.semanalService.getCargaCuadrante(this.auxiliar.DNIAuxiliar, "null").subscribe(
                          (cargaCuadrante) =>{
                              loading.dismiss(cargaCuadrante);
                          },
                          error => {
                              loading.dismiss(null);
                          });
      }else{
        loading.dismiss(null);
      }                      
    },
    error =>{
      console.log(error);
    });

    this.items = [
      {"Title":"Lunes", "Description":"Antonio López, Juan Manuel, Pepe Rios, Maria Sanchez", "Time":"8:00 - 10:00"},
      {"Title":"Martes", "Description":"Maria Sanchez, Pepe Rios, Antonia Ruiz, Antonio López", "Time":"8:00 - 10:00"},
      {"Title":"Miércoles", "Description":"Antonio López, Juan Manuel, Pepe Rios, Maria Sanchez", "Time":"8:00 - 10:00"},
      {"Title":"Jueves", "Description":"Maria Sanchez, Pepe Rios, Antonia Ruiz, Antonio López", "Time":"8:00 - 10:00"},
      {"Title":"Viernes", "Description":"Antonio López, Juan Manuel, Pepe Rios, Maria Sanchez", "Time":"8:00 - 10:00"}
    ];
  }

  getDiaCompleto(diaLetra: string){
    let diaCompleto;
    switch(diaLetra){
      case 'L':
        diaCompleto = 'Lunes';
        break;
      case 'M':
        diaCompleto = 'Martes';
        break;
        case 'X':
        diaCompleto = 'Miercoles';
        break;
        case 'J':
        diaCompleto = "Jueves";
        break;
        case 'V':
        diaCompleto = "Viernes";
        break;
        default:
        diaCompleto = "Lunes";
    }
    
    return diaCompleto;
  }

  generateArrayDiasOrder(){
    let stringsLunes = "", stringsMartes = "", stringsMiercoles = "", stringsJueves = "", stringsViernes = "";
    this.arrayDias[0] = {"Dia":"Lunes", "Nombres": "Sin visitas", "DiaLetra":"L"};
    this.arrayDias[1] = {"Dia":"Martes", "Nombres": "Sin visitas", "DiaLetra":"M"};
    this.arrayDias[2] = {"Dia":"Miercoles", "Nombres": "Sin visitas", "DiaLetra":"X"};
    this.arrayDias[3] = {"Dia":"Jueves", "Nombres": "Sin visitas", "DiaLetra":"J"};
    this.arrayDias[4] = {"Dia":"Viernes", "Nombres": "Sin visitas", "DiaLetra":"V"};
    if(this.cargaCuadrante != null){
      for (var i = 0; i < this.cargaCuadrante.length; i++) {
        switch(this.cargaCuadrante[i].DiaSemana){
          case 'L':
            stringsLunes = stringsLunes + this.cargaCuadrante[i].Nombre + ", ";
            this.arrayDias[0] = {"Dia":"Lunes", "Nombres": stringsLunes, "DiaLetra":"L"};//this.arrayDias[0].Nombres + 
            break;
          case 'M':
            stringsMartes = stringsMartes + this.cargaCuadrante[i].Nombre + ", ";
            this.arrayDias[1] = {"Dia":"Martes", "Nombres": stringsMartes, "DiaLetra":"M"};
            break;
          case 'X':
            stringsMiercoles = stringsMiercoles + this.cargaCuadrante[i].Nombre + ", ";
            this.arrayDias[2] = {"Dia":"Miercoles", "Nombres": stringsMiercoles, "DiaLetra":"X"};
            break;
          case 'J':
            stringsJueves = stringsJueves + this.cargaCuadrante[i].Nombre + ", ";
            this.arrayDias[3] = {"Dia":"Jueves", "Nombres": stringsJueves, "DiaLetra":"J"};
            break;
          case 'V':
            stringsViernes = stringsViernes + this.cargaCuadrante[i].Nombre + ", ";
            this.arrayDias[4] = {"Dia":"Viernes", "Nombres": stringsViernes, "DiaLetra":"V"};
            break;
          default:
            stringsLunes = stringsLunes + this.cargaCuadrante[i].Nombre + ", ";
            this.arrayDias[0] = {"Dia":"Lunes", "Nombres": stringsLunes, "DiaLetra":"L"};
        }
        console.log(this.arrayDias);
        //console.log(this.cargaCuadrante[i]);   
      }
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

    itemTapped(item) {
      this.navController.push(HoyPage, {
      item: item,
      nota: this.nota
      });
  };
}
