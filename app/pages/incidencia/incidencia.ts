import {Component, NgZone} from '@angular/core';
import {NavController, Alert, Modal, ActionSheet, Storage, SqlStorage} from 'ionic-angular';
import {GalleryModalPage} from './../galleryModal/galleryModal';
import {Geolocation, Camera, ImagePicker} from 'ionic-native';
import {UtilsProvider} from './../../providers/utils';
import {Usuario} from './../detalle/detalleInterface'
import {Tipo} from './../incidencia/incidenciaInterface'
import {Auxiliar} from './../login/loginInterface';
import {incidenciaService} from './incidenciaService'

@Component({
  templateUrl: 'build/pages/incidencia/incidencia.html',
  providers: [UtilsProvider, incidenciaService]
})
export class IncidenciaPage {

  images: any;
  uploadingImages: any;
  base64string = "data:image/jpeg;base64,";
  storage: any;
  auxiliar: Auxiliar;
  arrayUsuarios: Array<Usuario>;
  arrayTipos: Array<Tipo>;
  DateIni: any;
  HourIni: any;
  listUsuarioSelect: any;
  listTipoSelect: any;
  Obs: any;

  constructor(private navController: NavController
  , private _ngZone: NgZone
  , private utils: UtilsProvider
  , private incidenciaService: incidenciaService) {
    this.images = ["", "", "", ""];
    this.uploadingImages = [false, false, false, false];
  }

  ionViewDidEnter(){
    this.storage = new Storage(SqlStorage);


    this.storage.get('auxiliar').then((auxiliar) =>{
      if(auxiliar != "" && auxiliar != undefined){        
        this.auxiliar = JSON.parse(auxiliar.toString());

        //refrescar USUARIOS
        this.storage.get('usuarios').then((usuarios) =>{
            this.storage.get('usuarios').then((usuarios) =>{
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
          });
        },
        error =>{
          console.log(error);
        });

        //refrescar TIPOS
        this.storage.get('tipos').then((tipos) =>{
            this.storage.get('tipos').then((tipos) =>{
              if(tipos != "" && tipos != undefined){        
                this.arrayTipos = JSON.parse(tipos.toString());
              }else{
                this.incidenciaService.getTipos(this.auxiliar.DNIAuxiliar).subscribe((tipos) =>{                                    
                                            this.arrayTipos = tipos;
                                            this.storage.set('tipos', JSON.stringify(this.arrayTipos));
                                        },
                                        error => {
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
    },
    error =>{
      console.log(error);
    });
  }

  doAlert() {
    let alert = Alert.create({
      title: 'Incidencia enviada correctamente!',
      subTitle: 'Tu incidencia ha sido enviada correctamente.',
      buttons: ['OK']
    });
    this.navController.present(alert);
  };

  sendIncentAndPhotos(){
    if(this.auxiliar != undefined){
      
        let DNIAuxiliar = this.auxiliar.DNIAuxiliar;
        let Auxiliar = this.auxiliar.NomCompleto;
        let Fecha_Incidencia = this.DateIni + " " + this.HourIni +":00";
        //Fecha_Incidencia = Fecha_Incidencia.replace("-", "/");
        let Hora_Incidencia = "1899-12-30 " + this.HourIni +":00" //this.HourIni;
        //Hora_Incidencia = Hora_Incidencia.replace("-", "/"); 
        let Usuario_ID = this.listUsuarioSelect;//this.arrayUsuarios[this.listUsuarioSelect].Usuario_ID;
        let Usuario = ""; //this.arrayUsuarios[this.listUsuarioSelect].NomCompleto;
        for(let i = 0; i < this.arrayUsuarios.length; ++i) { 
          if(this.arrayUsuarios[i].Usuario_ID == this.listUsuarioSelect){
            Usuario = this.arrayUsuarios[i].NomCompleto;
          }
        }
        let MotivoIncidencia = this.listTipoSelect; //this.arrayTipos[this.listTipoSelect].CodigoMotivo;
        let Observaciones = this.Obs;


        this.incidenciaService.nuevaIncidencia(DNIAuxiliar, Auxiliar, Fecha_Incidencia, Hora_Incidencia, Usuario_ID, Usuario, MotivoIncidencia, Observaciones).subscribe((ID_inserted) =>{
                                  if(ID_inserted.RegIncPresSAD_ID_Inserted =! 0){
                                    //this.doAlert();

                                    if(this.sendPhoto(DNIAuxiliar, this.images[0], ID_inserted.RegIncPresSAD_ID_Inserted)){
                                      this.doAlert();
                                    }

                                    /*for(let i = 0; i < this.images.length; ++i) {
                                      if(this.sendPhoto(DNIAuxiliar, this.images[i], ID_inserted[0].RegIncPresSAD_ID_Inserted)){
                                        this.uploadingImages[i] = true;
                                      }else{
                                        this.showAlert("Error", "Imagen no enviada", "Aceptar");
                                        this.uploadingImages[i] = false;
                                      }
                                    }*/

                                  }else{
                                    this.showAlert("Error!", "Incidencia no enviada", "Aceptar");
                                  }
                                },
                                error => {
                                    this.showAlert("Error", "Incidencia no enviada", "Aceptar");
                                });

      }
  }

    sendPhoto(DNIAuxiliar, photoBase64, RegIncPresSAD_ID_Inserted): Boolean{
      let respuesta: boolean;
      this.incidenciaService.guardarFotoBase64(DNIAuxiliar, photoBase64, RegIncPresSAD_ID_Inserted).subscribe((ID_inserted) =>{
                                    if(ID_inserted.rutaFoto =! ""){
                                      respuesta = true;
                                    }else{
                                      respuesta = false;
                                    }
                                  },
                                  error => {
                                      respuesta = false;
                                  })
      return respuesta;
    }

  openGallery(){
    let galleryModal = Modal.create(GalleryModalPage, this.images);      
    //galleryModal.onDismiss(data => {
      //console.log(data);
    //});     
    this.navController.present(galleryModal);  
  };

  takePhoto(id){
    let actionSheet = ActionSheet.create({
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
                        console.log(imgResized);
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
            Camera.getPicture({quality: 100, destinationType: Camera.DestinationType.DATA_URL}).then((imageURI) => {//, destinationType: Camera.DestinationType.DATA_URL
              this.utils.resizeImage(this.base64string + imageURI, 1024, 768).then((imgResized) => {
                //this.uploadImage(imgResized, id);
                console.log(imgResized);
                this._ngZone.run(() => {
                  this.images[id] = imgResized;
                });
                this.uploadingImages[id] = false;
              });
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
    this.navController.present(actionSheet);
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
