import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { VerifyCodePage } from '../verifycode/verifycode';
import { API_URI } from '../../../providers/config';


@Component({
    templateUrl: 'build/pages/forgot/sendcode/sendcode.html'    
})

export class ForgotPasswordPage{
    forgotData : {email?: string};
    progress = false;

    constructor(public navCtrl: NavController, public http: Http, public alertCtrl: AlertController){
        this.forgotData = {
            email: ''
        };
    }

    doSend(){
        this.showProgress();     
        this.http.post(API_URI + "sendcode", this.forgotData).subscribe(res => {        
            this.hideProgress();   
            if(res.json().status == false){
                let alert = this.alertCtrl.create({
                    title: "Failed",
                    subTitle: res.json().error,
                    buttons:['OK']
                });
                alert.present();
            }else{
                this.navCtrl.push(VerifyCodePage, {
                    email: this.forgotData.email
                });
            }
        }, err => {
            this.hideProgress();
            let alert = this.alertCtrl.create({
                title: "Failed",
                subTitle: "please check internet connection",
                buttons: ["OK"]
            });
            alert.present();
        });        
    }

    showProgress(){
        this.progress = true;
    } 

    hideProgress(){
        this.progress = false;
    }
}