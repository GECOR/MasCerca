import {Injectable} from '@angular/core';
import {LoadingController , NavController, AlertController, Platform, App} from 'ionic-angular';
//import { NativeStorage } from 'ionic-native';
import { Storage } from '@ionic/storage';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {LoginPage} from '../pages/login/login';

@Injectable()
export class UtilsProvider {

  alert: any;
  //storage: any;

  constructor(private http: Http
            , private nav: NavController
            , public alertCtrl: AlertController
            , public loadingCtrl: LoadingController
            , public storage: Storage
            , private app: App 
            , private platform: Platform) {}

  getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
        var dLon = this.deg2rad(lon2-lon1); 
        var a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2)
            ; 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km
        return d;
        }

    deg2rad(deg) {
        return deg * (Math.PI/180)
    }

    roundTwoDecimals(number){
        return Math.round(number * 100) / 100;
    }

    getLoading(title: string){
        return this.loadingCtrl.create({
            content: title
        });
    }

    resizeImage(imageUri, width, height){

        return new Promise((resolve, reject) => {
            var c=document.createElement('canvas');
            var ctx=c.getContext("2d");

            //var cw=c.width;
            //var ch=c.height;

            var maxW=width;
            var maxH=height;

            var img=new Image();
            img.src=imageUri;
            img.onload = () => {
                var iw=img.width;
                var ih=img.height;

                var scale=Math.min((maxW/iw),(maxH/ih));

                var iwScaled=iw*scale;
                var ihScaled=ih*scale;

                c.width=iwScaled;
                c.height=ihScaled;

                ctx.drawImage(img,0,0,iwScaled,ihScaled);

                resolve(c.toDataURL("image/jpeg", 1.0));
            };
        });
    }

    getContentLengthFromUrl(url: string): Observable<any> {
        
        return this.http.get(url)
                        .map(this.extractData)
                        .catch(this.handleError);
                    
    }

    extractData(res: Response){
        console.log(res);
    }

    alertLogOut(){
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
                    //this.nav.pop();
                    this.storage.set('auxiliar', '');
                    //this.platform.exitApp();
                    //this.nav.push(LoginPage);
                    let _nav = this.app.getRootNav();
                    _nav.setRoot(LoginPage);
                }
                }
            ]
            });
            this.alert.present();
        }
    }

    logOut(){

    }
    
    private handleError (error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
