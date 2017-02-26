import { Component } from '@angular/core';
import { NavController, AlertController, Events } from 'ionic-angular';
import { Camera, Transfer } from 'ionic-native';
import { Http } from '@angular/http';
import { API_URI } from '../../../providers/config';

@Component({
    templateUrl: 'build/pages/magazine/create/create.html'
})

export class MagazineCreatePage {
    data: {
        image_data?: string,
        pdf_data?: string
    };
    
    constructor(public navCtrl: NavController, public http: Http, public alertCtrl: AlertController, public events: Events){
        this.data = {
            image_data: null,
            pdf_data: null
        };       
    }

    goBack(){
        this.navCtrl.pop();
    }

    saveCover(){
        let options = {
            quality: 75,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 300,
            targetHeight: 500,
            saveToPhotoAlbum: false
        };

        Camera.getPicture(options).then((imageData) => {
            this.data.image_data = 'data:image/jpeg;base64,' + imageData;            
        });
    }

    savePDF(){

    }

    save(){

    }
}