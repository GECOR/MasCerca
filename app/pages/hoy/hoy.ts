import {Component} from '@angular/core';
import {NavController, Storage, SqlStorage, MenuController, Alert, NavParams} from 'ionic-angular';
import {detallePage} from '../detalle/detalle';
import {UtilsProvider} from './../../providers/utils';
import {Auxiliar} from './../login/loginInterface';
import {CargaCuadrante} from './../semanal/semanalInterface';
import {HoyPipe} from './hoyPipe';
import {semanalService} from './../semanal/semanalService';

@Component({
  templateUrl: 'build/pages/hoy/hoy.html',
  providers: [UtilsProvider, MenuController, semanalService], //, NavController, MenuController
  pipes: [HoyPipe]
})
export class HoyPage {

  item: any;
  currentDate;
  auxNomCompleto;
  storage: any;
  auxiliar: Auxiliar;
  diaCompleto;
  days = ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'];
  //items = [];
  tempArrayCargaCuadrante: Array<CargaCuadrante>;
  arrayCargaCuadrante: Array<CargaCuadrante>;
  //private pages: any[];

  constructor(private navController: NavController
            , private utils: UtilsProvider
            , private params: NavParams
            , private semanalService: semanalService) {
            //, private menu: MenuController) {

    /*this.storage = new Storage(SqlStorage);

    this.storage.get('auxiliar').then((auxiliar) =>{
      if(auxiliar != "" && auxiliar != undefined){        
        this.auxiliar = JSON.parse(auxiliar.toString());
      }
    },
    error =>{
      console.log(error);
    });*/

    /*this.app = app;
    this.menu = menu;
    this.pages = [
        { title: 'Nombre', component: this.auxNomCompleto },
        { title: 'Contact', component: detallePage }
        //{ title: 'About', component: AboutPage }
    ];*/

    /*this.items = [
      {"User":"Antonio López", "Task":"Aseo Persona, Aseo Hogar", "Time":"8:00 - 10:00", "Address":"Calle Larios, 20", "Phones":"952216766 - 952216620", "EIC":"1"},
      {"User":"Juan Manuel", "Task":"Aseo Persona, Aseo Hogar, Gestiones", "Time":"10:00 - 12:00", "Address":"Calle Trinidad, 10", "Phones":"952216766 - 952216620", "EIC":"0"},
      {"User":"Pepe Ejemplo", "Task":"Aseo Persona, Aseo Hogar, Gestiones, Limp. Choque", "Time":"12:30 - 13:00", "Address":"Calle Vendeja, 6", "Phones":"952216766 - 952216620", "EIC":"1"},
      {"User":"User4", "Task":"Aseo Persona, Aseo Hogar, Gestiones, Limp. Choque, Depositas Llaves", "Time":"13:00 - 14:00", "Address":"Calle Álamos, 12", "Phones":"952216766 - 952216620", "EIC":"0"},
      {"User":"User5", "Task":"Aseo Persona, Aseo Hogar, Gestiones, Limp. Choque, Depositas Llaves, Hoja de Tareas", "Time":"16:00 - 18:00", "Address":"Calle Ollerías, 8", "Phones":"952216766 - 952216620", "EIC":"0"}
    ];*/
    this.currentDate = new Date();
    this.diaCompleto = this.days[ this.currentDate.getDay() ];
    console.log(this.diaCompleto);

    this.item = this.params.get('item');
    if(this.item == null){
      this.item = {"Dia":this.diaCompleto, "Nombres": "Sin visitas", "DiaLetra":this.getDiaLetra()};
    }

  }

  ionViewDidEnter(){
    this.storage = new Storage(SqlStorage);

    this.storage.get('auxiliar').then((auxiliar) =>{
      if(auxiliar != "" && auxiliar != undefined){        
        this.auxiliar = JSON.parse(auxiliar.toString());
        this.auxNomCompleto = this.auxiliar.NomCompleto

        this.storage.get('cargaCuadrante').then((cargaCuadrante) =>{
          if(cargaCuadrante != "" && cargaCuadrante != undefined){
            this.tempArrayCargaCuadrante = JSON.parse(cargaCuadrante.toString());
            this.groupArray();
            //this.arrayCargaCuadrante = JSON.parse(cargaCuadrante.toString());
          }else{        
              this.semanalService.getCargaCuadrante(this.auxiliar.DNIAuxiliar, "null").subscribe((cargaCuadrante) =>{                                    
                                    this.tempArrayCargaCuadrante = cargaCuadrante;
                                    this.storage.set('cargaCuadrante', JSON.stringify(this.tempArrayCargaCuadrante));
                                    this.groupArray();
                                },
                                error => {
                                    this.showAlert("Error", "No existe el usuario", "Aceptar");
                                });
          }
        },
        error =>{
          console.log(error);
        });

      }
    },
    error =>{
      console.log(error);
    });
  }

  showAlert(title, subTitle, okButton){
      let alert = Alert.create({
        title: title,
        subTitle: subTitle,
        buttons: [okButton]
      });
      this.navController.present(alert);
  }
  
  itemTapped(item) {
      this.navController.push(detallePage, {
      item: item
      });
  };

  groupArray(){
    this.arrayCargaCuadrante = new Array<CargaCuadrante>();
    this.tempArrayCargaCuadrante = new HoyPipe().transform(this.tempArrayCargaCuadrante, this.item.DiaLetra); 
    this.tempArrayCargaCuadrante.forEach(element => {
      //this.tiposElementos = this.tiposElementos.filter(item => item.FamiliaTipoElementoID == this.inc.familia.FamiliasTiposElementosID);
      let aux = new Array<CargaCuadrante>();
      aux = this.arrayCargaCuadrante.filter(item => (item.id_cliente == element.id_cliente) && (item.Hora == element.Hora));
      if (aux.length > 0){
        aux[0].subcategoria = aux[0].subcategoria + ", " + element.subcategoria;
      }else{
        this.arrayCargaCuadrante.push(element);
      }
    });
  }

  groupArray_old(){
    let idEncontrado = false;
    for (var x = 0; x < this.tempArrayCargaCuadrante.length; x++) {
      if(this.arrayCargaCuadrante != undefined){
        for (var i = 0; i < this.arrayCargaCuadrante.length; i++) {
        if((this.tempArrayCargaCuadrante[x].id_cliente = this.arrayCargaCuadrante[i].id_cliente) && (this.tempArrayCargaCuadrante[x].Hora = this.arrayCargaCuadrante[i].Hora)) {
          idEncontrado = true;
          this.arrayCargaCuadrante[i].subcategoria  = this.arrayCargaCuadrante[i].subcategoria +  this.tempArrayCargaCuadrante[x].subcategoria;
        }
        if(!idEncontrado){
          this.arrayCargaCuadrante.push(this.tempArrayCargaCuadrante[x]);
          idEncontrado = false;
        }else{
          idEncontrado = false;
        } 
      }
      }else{
        this.arrayCargaCuadrante = new Array<CargaCuadrante>();
        this.arrayCargaCuadrante.push(this.tempArrayCargaCuadrante[x]);
        idEncontrado = true;
      }
    }
  }

  getDiaLetra(){
    var diaLetra;
      switch(this.diaCompleto){
      case 'Lunes':
        diaLetra = 'L';
        break;
      case 'Martes':
        diaLetra = 'M';
        break;
        case 'Miercoles':
        diaLetra = 'X';
        break;
        case 'Jueves':
        diaLetra = "J";
        break;
        case 'Viernes':
        diaLetra = "V";
        break;
        case 'Sabado':
        diaLetra = "S";
        break;
        case 'Domingo':
        diaLetra = "D";
        break;
        default:
        diaLetra = "L";
    }
    return diaLetra;
  }

  /*openMenu() {
     this.menu.toggle();
  };

  openPage(page) {
        this.menu.close()
        let nav = this.app.getComponent('nav');
        nav.setRoot(page.component);
    }*/

}
