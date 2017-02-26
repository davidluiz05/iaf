import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { LoginPage } from '../../login/login';
import { API_URI } from '../../../providers/config';

@Component({
    templateUrl: 'build/pages/forgot/resetpass/resetpass.html'
})

export class ResetPasswordPage {
    data: {email?: string, password?: string, password_confirmation?: string};
    progress = false;

    constructor(private navCtrl: NavController, private navParams: NavParams, private http: Http, public alertCtrl: AlertController){
        this.data = {
            email: this.navParams.get('email'),
            password: "",
            password_confirmation: ""
        }
    }

    doResetPassword(){
        this.showProgress();      
        this.http.post(API_URI + "resetpass", this.data).subscribe(res => {   
            this.hideProgress();         
            if(res.json().status == false){
                let alert = this.alertCtrl.create({
                    title: "Failed",
                    subTitle: res.json().error,
                    buttons: ["OK"]
                });
                alert.present();
            }else{
                this.navCtrl.setRoot(LoginPage);
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