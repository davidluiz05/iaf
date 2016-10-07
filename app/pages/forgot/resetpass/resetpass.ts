import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { LoginPage } from '../../login/login';
import { Alert } from '../../../providers/alert';
import { Progress } from '../../../providers/loading';
import { API_URI } from '../../../providers/config';

@Component({
    templateUrl: 'build/pages/forgot/resetpass/resetpass.html',
    providers: [Alert, Progress]
})

export class ResetPasswordPage {
    data: {email?: string, password?: string, password_confirmation?: string};
    constructor(private navCtrl: NavController, private navParams: NavParams, private http: Http, private alert: Alert, private progress: Progress){
        this.data = {
            email: this.navParams.get('email'),
            password: "",
            password_confirmation: ""
        }
    }

    doResetPassword(){
        this.progress.show("");       
        this.http.post(API_URI + "resetpass", this.data).subscribe(res => {
            this.progress.dismiss();
            if(res.json().status == false){
                this.alert.show("Reset Password Failed", res.json().error);
            }else{
                this.alert.show("Reset Password Success", "Please try to login with new password");
                this.navCtrl.push(LoginPage);
            }
        });        
    }
}