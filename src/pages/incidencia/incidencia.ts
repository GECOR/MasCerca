import { Component, NgZone } from '@angular/core';
import { NavController, ModalController, ActionSheetController, AlertController, LoadingController, NavParams } from 'ionic-angular';
//import { NativeStorage } from 'ionic-native';
import { Storage } from '@ionic/storage';
import { GalleryModalPage } from './../galleryModal/galleryModal';
import { Camera, ImagePicker } from 'ionic-native';
import { UtilsProvider } from './../../providers/utils';
import { Usuario } from './../detalle/detalleInterface'
import { Tipo } from './../incidencia/incidenciaInterface'
import { Auxiliar } from './../login/loginInterface';
import { incidenciaService } from './incidenciaService'

@Component({
  templateUrl: 'incidencia.html',
  providers: [UtilsProvider, incidenciaService, Storage]
})
export class IncidenciaPage {

  images: any;
  uploadingImages: any;
  base64string = "data:image/jpeg;base64,";
  //storage: any;
  auxiliar: Auxiliar;
  arrayUsuarios: Array<Usuario>;
  arrayTipos: Array<Tipo>;
  DateIni: string;
  HourIni: string;
  listUsuarioSelect: any;
  listTipoSelect: any;
  Obs: string = "";
  loading: any;

  constructor(private navController: NavController
  , private params: NavParams
  , private _ngZone: NgZone
  , public utils: UtilsProvider
  , public alertCtrl: AlertController
  , public modalCtrl: ModalController
  , public storage: Storage
  , public actionSheetCtrl: ActionSheetController
  , private incidenciaService: incidenciaService
  , public loadingCtrl: LoadingController) {

    if(params.get("id_cliente"))
      this.listUsuarioSelect = params.get("id_cliente");

    this.images = ["", "", "", ""];
    this.uploadingImages = [false, false, false, false];

    var _d = new Date(new Date().toLocaleString());
    this.DateIni = _d.getFullYear() + '-' + this.pad(_d.getMonth() + 1) + '-' + this.pad(_d.getDate()) + 'T' 
    + this.pad(_d.getHours()) + ':' + this.pad(_d.getMinutes()) + ':00.000';
    this.HourIni = this.DateIni;
  }

  pad(n) {
    return (n < 10) ? ("0" + n) : n;
  }

  ionViewDidEnter(){
    
    //this.DateIni = new Date();
   //this.HourIni 

    this.storage.get('auxiliar').then((auxiliar) =>{
      if(auxiliar != "" && auxiliar != undefined){    
        
        //refrescar USUARIOS
        //this.storage.get('usuarios').then((usuarios) =>{
            /*this.storage.get('usuarios').then((usuarios) =>{
              if(usuarios != "" && usuarios != undefined){        
                this.arrayUsuarios = JSON.parse(usuarios.toString());
              }else{
                this.incidenciaService.getUsuariosFromAux(this.auxiliar.DNIAuxiliar).subscribe((usuarios) =>{                                    
                                            this.arrayUsuarios = usuarios;
                                            this.storage.set('usuarios', JSON.stringify(this.arrayUsuarios));
                                        },
                                        error => {
                                            this.showAlert("Error", "No se pueden recuperar los usuarios del servidor", "Aceptar");
                                        });
              }
          },
          error =>{
            console.log(error);
          });*/
        /*},
        error =>{
          console.log(error);
        });*/


        this.loading = this.loadingCtrl.create({
          content: 'Obteniendo usuarios...'
        });
        
        this.loading.present();

        this.auxiliar = JSON.parse(auxiliar.toString());


        this.incidenciaService.getUsuariosFromAux(this.auxiliar.DNIAuxiliar).subscribe((usuarios) =>{                                    
                                            this.arrayUsuarios = usuarios;
                                            this.storage.set('usuarios', JSON.stringify(this.arrayUsuarios));
                                            this.loading.dismiss();
                                            this.getTipos();
                                        },
                                        error => {
                                            this.loading.dismiss();
                                            //this.getTipos();
                                            this.showAlert("Error", "No se pueden recuperar los usuarios del servidor", "Aceptar");
                                        });

        

      }
    },
    error =>{
      console.log(error);
    });
  }

getTipos(){
  //refrescar TIPOS
        this.storage.get('tipos').then((tipos) =>{
            this.storage.get('tipos').then((tipos) =>{
              if(tipos != "" && tipos != undefined){        
                this.arrayTipos = JSON.parse(tipos.toString());
              }else{
                 this.loading = this.loadingCtrl.create({
                    content: 'Obteniendo tipos...'
                  });
                  
                  this.loading.present();

                  this.incidenciaService.getTipos(this.auxiliar.DNIAuxiliar).subscribe((tipos) =>{                                    
                                            this.arrayTipos = tipos;
                                            this.storage.set('tipos', JSON.stringify(this.arrayTipos));
                                            this.loading.dismiss();
                                        },
                                        error => {
                                            this.loading.dismiss();
                                            this.showAlert("Error", "No se pueden recuperar los tipos del servidor", "Aceptar");
                                        });
              }
          },
          error =>{
            console.log(error);
          });
        },
        error =>{
          console.log(error);
        });
}

  sendIncentAndPhotos(){
    if(this.auxiliar != undefined){
      
        let DNIAuxiliar = this.auxiliar.DNIAuxiliar;
        let Auxiliar = this.auxiliar.NomCompleto;

        //let Fecha_Incidencia = this.DateIni + " " + this.HourIni +":00";
        //Fecha_Incidencia = Fecha_Incidencia.replace("-", "/");
        //let Hora_Incidencia = "1899-12-30 " + this.HourIni +":00" //this.HourIni;
        //Hora_Incidencia = Hora_Incidencia.replace("-", "/"); 
        var _d = new Date(this.DateIni.split('T')[0]+'T'+this.HourIni.split('T')[1]);
        _d.setTime( _d.getTime() + _d.getTimezoneOffset()*60*1000 );
        let Fecha_Incidencia = _d.getFullYear() + this.pad(_d.getMonth() + 1) + this.pad(_d.getDate()) + this.pad(_d.getHours()) + this.pad(_d.getMinutes()) + this.pad(_d.getSeconds());

        let Usuario_ID = this.listUsuarioSelect;//this.arrayUsuarios[this.listUsuarioSelect].Usuario_ID;
        let Usuario = ""; //this.arrayUsuarios[this.listUsuarioSelect].NomCompleto;
        for(let i = 0; i < this.arrayUsuarios.length; ++i) { 
          if(this.arrayUsuarios[i].Usuario_ID == this.listUsuarioSelect){
            Usuario = this.arrayUsuarios[i].NomCompleto;
          }
        }
        let MotivoIncidencia = this.listTipoSelect; //this.arrayTipos[this.listTipoSelect].CodigoMotivo;
        let Observaciones = this.Obs;

        this.loading = this.loadingCtrl.create({
          content: 'Enviando incidencia...'
        });

        this.loading.onDidDismiss((RegIncPresSAD_ID_Inserted) => {
          if (RegIncPresSAD_ID_Inserted > 0){
            this.clearForm();
            let alert = this.alertCtrl.create({
              title: 'Incidencia enviada correctamente!',
              subTitle: 'Tu incidencia ha  enviada correctamente con ID: ' + RegIncPresSAD_ID_Inserted,
              buttons: ['OK']
            });
            alert.present();
          }else{
            let alert = this.alertCtrl.create({
              title: 'Error!',
              subTitle: 'Ha ocurrido un error.',
              buttons: ['OK']
            });
            alert.present();
          }          
        });

        this.loading.present();


        this.incidenciaService.nuevaIncidencia(DNIAuxiliar, Auxiliar, Fecha_Incidencia, Fecha_Incidencia, Usuario_ID, Usuario, MotivoIncidencia, Observaciones).subscribe((ID_inserted) =>{
                                  console.log(ID_inserted[0].RegIncPresSAD_ID_Inserted);
                                  if(ID_inserted[0].RegIncPresSAD_ID_Inserted > 0){

                                    this.sendPhoto(DNIAuxiliar, 0, ID_inserted[0].RegIncPresSAD_ID_Inserted);
                                    
                                    /*for(let i = 0; i < this.images.length; ++i) {
                                        if(this.sendPhoto(DNIAuxiliar, this.images[i], ID_inserted[0].RegIncPresSAD_ID_Inserted, loading)){
                                          this.uploadingImages[i] = true;
                                        }else{
                                          this.showAlert("Error", "Imagen no enviada", "Aceptar");
                                          this.uploadingImages[i] = false;
                                        }
                                    }*/

                                  }else{
                                    this.loading.dismiss(0);
                                  }
                                },
                                error => {
                                  this.loading.dismiss(0);
                                });

      }
  }

    sendPhoto(DNIAuxiliar, id, RegIncPresSAD_ID_Inserted){
      console.log("id - "+ id);
      if (this.images[id] != ""){
        this.incidenciaService.guardarFotoBase64(DNIAuxiliar, this.images[id], RegIncPresSAD_ID_Inserted).subscribe((ID_inserted) =>{
          console.log(ID_inserted);
          /*if(ID_inserted.rutaFoto =! ""){
            this.uploadingImages[id] = true;
          }else{
            this.uploadingImages[id] = false;
          }*/
          if (id + 1 < this.images.length){
            console.log("uno");
            this.sendPhoto(DNIAuxiliar, id + 1, RegIncPresSAD_ID_Inserted)
          } else{
            console.log("dos");
            this.loading.dismiss(RegIncPresSAD_ID_Inserted);
          }
        },
        error => {
            //this.uploadingImages[id] = false;
        })
      }else{
        if (id + 1 < this.images.length){
          console.log("uno");
          this.sendPhoto(DNIAuxiliar, id + 1, RegIncPresSAD_ID_Inserted)
        } else{
          console.log("dos");
          this.loading.dismiss(RegIncPresSAD_ID_Inserted);
        }
      }
      
    }

  openGallery(){
    let galleryModal = this.modalCtrl.create(GalleryModalPage, this.images);      
    //galleryModal.onDismiss(data => {
      //console.log(data);
    //});     
     galleryModal.present();
  };

  alertTakePhoto(id){
    let alert = this.alertCtrl.create({
      title: 'Aviso',
      message: 'Prohibido fotografiar a las personas',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.takePhoto(id);
            console.log('Buy clicked');
          }
        }
      ]
    });
    alert.present();
  }

  takePhoto(id){
    let actionSheet = this.actionSheetCtrl.create({
      title: '',
      buttons: [
        {
          text: "Galeria",
          handler: () => {
          this.uploadingImages[id] = true;
          ImagePicker.getPictures({maximumImagesCount: 1}).then((results) => {
                    /*
                    for (var i = 0; i < results.length; i++) {
                        //console.log('Image URI: ' + results[i]);
                        this._ngZone.run(() => {
                          this.images[i] = results[i];
                        });
                    }
                    */
                    if (results.length > 0){
                      this.utils.resizeImage(results[0], 1024, 768).then((imgResized) => {
                        //this.uploadImage(imgResized, id);
                        this._ngZone.run(() => {
                          this.images[id] = imgResized;
                        });
                        this.uploadingImages[id] = false;
                        });
                    }else{
                      this.uploadingImages[id] = false;
                    }
                    
                    
                }, (error) => {
                    console.log('Error: ' + error);
                    this.uploadingImages[id] = false;
                }
            );
          }
        },
        {
          text: "Camara",
          handler: () => {
            this.uploadingImages[id] = true;            
            Camera.getPicture({destinationType: Camera.DestinationType.DATA_URL, correctOrientation: true}).then((imageURI) => {//, destinationType: Camera.DestinationType.DATA_URL
              /*this.utils.resizeImage(this.base64string + imageURI, 1024, 768).then((imgResized) => {
                //this.uploadImage(imgResized, id);
                console.log(imgResized);
                this._ngZone.run(() => {
                  this.images[id] = imgResized;
                });
                this.uploadingImages[id] = false;
              });*/

              this._ngZone.run(() => {
                this.images[id] = this.base64string + imageURI;
              });
              this.uploadingImages[id] = false;
            }, (message) => {
              this.showAlert("Alerta", "mensaje: " + message, "Aceptar");
              console.log('Failed because: ' + message);
              this.uploadingImages[id] = false;
              console.log(message);
            });
          }
        },
        {
          text: "Cancelar",
          role: 'cancel',
          handler: () => {
            console.log("Cancel clicked");
            this.uploadingImages[id] = false;
          }
        }
      ]
    });
    actionSheet.present();
  };

  showAlert(title, subTitle, okButton){
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: [okButton]
    });
    alert.present();
  }

  clearForm(){
    this.listUsuarioSelect = undefined;
    this.listTipoSelect = undefined;
    
    var _d = new Date(new Date().toLocaleString());
    this.DateIni = _d.getFullYear() + '-' + this.pad(_d.getMonth() + 1) + '-' + this.pad(_d.getDate()) + 'T' 
    + this.pad(_d.getHours()) + ':' + this.pad(_d.getMinutes()) + ':00.000' + 'Z';
    this.HourIni = this.DateIni;

    this.Obs = "";
    this.images = ["", "", "", ""];
    this.uploadingImages = [false, false, false, false];
  }
  
}
