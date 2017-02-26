import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, NavParams,AlertController } from 'ionic-angular';
import { ResetPasswordPage } from '../resetpass/resetpass';
import { API_URI } from '../../../providers/config';

@Component({
    templateUrl: 'build/pages/forgot/verifycode/verifycode.html'
})

export class VerifyCodePage {
    data: {email?: string, code?: string};
    progress = false;

    constructor(private navCtrl: NavController, private navParams: NavParams, private http: Http, public alertCrrl: AlertController){
        this.data = {
            email: this.navParams.get('email'),
            code: ''
        };        
    }    

    doSend(){
        this.showProgress();   
        this.http.post(API_URI + "checkcode", this.data).subscribe(res => {  
            this.hideProgress();          
            if(res.json().status == false){
                let alert = this.alertCrrl.create({
                    title: "Failed",
                    subTitle: res.json().error,
                    buttons: ["OK"]
                });
                alert.present();
            }else{
                this.navCtrl.push(ResetPasswordPage, {
                    email: this.data.email
                });
            }
        }, err => {
            this.hideProgress();
            let alert = this.alertCrrl.create({
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