import {Injectable} from '@angular/core';
import {Geolocation, Geocoder, GeocoderRequest} from 'ionic-native';


@Injectable()
export class GeolocationProvider {
  location: any = {};
  //MAP
  map: any;
  latLng: any;
  geocoderService: Geocoder;
  startAddress: string;
  // google maps zoom level
  // initial center position for the map
  lat: number;
  lng: number;
  //END MAP

  constructor() {}

  locate() {
    let options = {maximumAge: 5000, timeout: 10000, enableHighAccuracy: false};
    /*navigator.geolocation*/
    return new Promise(resolve => {        
        Geolocation.getCurrentPosition(options).then((position) => { 
            resolve(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));


            //this.geocoderService = new google.maps.Geocoder;

            /*let geoReq: GeocoderRequest = {
                position: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
            };
          
            Geocoder.geocode(geoReq).then(results =>{
                if (results.length) {
                    var result = results[0];
                    var position = result.position; 
                    var address = [
                    result.subThoroughfare || "",
                    result.thoroughfare || "",
                    result.locality || "",
                    result.adminArea || "",
                    result.postalCode || "",
                    result.country || ""].join(", ");

                    this.location.latLng = position;
                    this.location.startAddress = address;

                    resolve(this.location);
                } else {
                    resolve("Not found");
                }                
        });*/

          //this.location.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          //this.location.lat = position.coords.latitude;
          //this.location.lng = position.coords.longitude;

          /*this.geocoderService.geocode({'location': this.location.latLng}, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    this.location.startAddress = results[0].formatted_address;
                        resolve(this.location);
                        //_this.loadMap();
                    } else {
                        //window.alert('No results found');
                    }
                } else {
                    //window.alert('Geocoder failed due to: ' + status);
                }
            });
            },(error) => {
                resolve({'error': error});
            }*/
        //);
        
        }).catch((error) => {
            console.log('Error getting location', error);
            resolve(new google.maps.LatLng(0,0));
        });
    });
  }

  getLocation(): any {
    return this.locate().then(location => {
      return location;
    });
  }
  
  getDirection(latLng) {
    return new Promise(resolve => {        
        /*if(this.geocoderService == undefined || this.geocoderService == null)
        this.geocoderService = new google.maps.Geocoder;
        
        this.geocoderService.geocode({'location': latLng}, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                this.location.latLng = results[0].geometry.location;
                this.location.lat = results[0].geometry.location.lat();
                this.location.lng = results[0].geometry.location.lng();
                this.location.startAddress = results[0].formatted_address;
                resolve(this.location);                    
            } else {                    
                resolve({'error': 'No results found'});
            }
            } else {                    
                resolve({'error': 'Geocoder failed due to: ' + status});
            }
        });*/  

        let geoReq: GeocoderRequest = {
            position: {
                lat:  latLng.lat(),
                lng: latLng.lng()
            }
        };
        
        Geocoder.geocode(geoReq).then(results =>{
            if (results.length) {
                var result = results[0];
                var position = result.position; 
                var address = [
                result.subThoroughfare || "",
                result.thoroughfare || "",
                result.locality || "",
                result.adminArea || "",
                result.postalCode || "",
                result.country || ""].join(", ");

                this.location.latLng = position;
                this.location.startAddress = address;

                resolve(this.location);
            } else {
                resolve("Not found");
            }                
        });          
    });
  }

  getLatLngFromDirection(direction: string){
    return new Promise(resolve => {  
        
        var request = {
        'address': direction
        };

        Geocoder.geocode(request).then(results =>{
            if (results.length) {
                var result = results[0];
                var position = result.position; 

                console.log(position);
                
                resolve(position);
            } else {
                resolve(undefined);
            }
        });
     });
  }
  
}
