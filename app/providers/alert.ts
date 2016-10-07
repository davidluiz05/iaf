import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

@Injectable()
export class Alert {
    alert: any;
    constructor(private alertCtrl: AlertController){}
    
    show(title: string, subTitle: string){
        this.alert = this.alertCtrl.create({
            title: title,
            subTitle: subTitle,
            buttons: ['OK']
        });
        this.alert.present();
    }
}