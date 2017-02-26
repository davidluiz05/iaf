import { Component } from '@angular/core';
import { NavController, AlertController, Events } from 'ionic-angular';
import { Camera } from 'ionic-native';
import { Http } from '@angular/http';
import { API_URI } from '../../../providers/config';

@Component({
    templateUrl: "build/pages/post/create/create.html"
})

export class PostCreatePage {
    data: {
        title?: string,
        content?: string,
        image_data?: string
    };
    constructor(public navCtrl: NavController, public http: Http, public alertCtrl: AlertController, public events: Events){
        this.data = {
            title: null,
            content: null,
            image_data: null
        };
    }

    goBack(){
        this.navCtrl.pop();
    }

    savePic(){
        let options = {
            quality: 75,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 300,
            targetHeight: 300,
            saveToPhotoAlbum: false
        };

        Camera.getPicture(options).then((imageData) => {
            this.data.image_data = 'data:image/jpeg;base64,' + imageData;            
        });
    }

    save(){
        this.http.post(API_URI + "createnews", this.data).subscribe(res => {
            if(res.json().status == false){
                let alert = this.alertCtrl.create({
                    title: "Failed",
                    subTitle: res.json().error,
                    buttons: ["OK"]
                });
                alert.present();
            }else{
                this.events.publish('addnews');
                this.navCtrl.pop();
            }
        }, err => {
            let alert = this.alertCtrl.create({
                    title: "Failed",
                    subTitle: "please check internet connection",
                    buttons: ["OK"]
                });
                alert.present();
        });
    }
}