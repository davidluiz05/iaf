import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { ResetPasswordPage } from '../resetpass/resetpass';
import { Alert } from '../../../providers/alert';
import { Progress } from '../../../providers/loading';
import { API_URI } from '../../../providers/config';

@Component({
    templateUrl: 'build/pages/forgot/verifycode/verifycode.html',
    providers: [Alert, Progress]
})

export class VerifyCodePage {
    data: {email?: string, code?: string};

    constructor(private navCtrl: NavController, private navParams: NavParams, private alertCtrl: Alert, private progress: Progress, private http: Http){
        this.data = {
            email: this.navParams.get('email'),
            code: ''
        };        
    }    

    doSend(){
        this.progress.show("");       
        this.http.post(API_URI + "checkcode", this.data).subscribe(res => {
            this.progress.dismiss();
            if(res.json().status == false){
                this.alertCtrl.show("Failed", res.json().error);
            }else{
                this.navCtrl.push(ResetPasswordPage, {
                    email: this.data.email
                });
            }
        });        
    }    
}