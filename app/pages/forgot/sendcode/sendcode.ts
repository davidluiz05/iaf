import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import { VerifyCodePage } from '../verifycode/verifycode';
import { Progress } from '../../../providers/loading';
import { Alert } from '../../../providers/alert';
import { API_URI } from '../../../providers/config';


@Component({
    templateUrl: 'build/pages/forgot/sendcode/sendcode.html',
    providers: [Progress, Alert]
})

export class ForgotPasswordPage{
    forgotData : {email?: string};
    constructor(public navCtrl: NavController, public http: Http, public progress: Progress, public alert: Alert){
        this.forgotData = {
            email: ''
        };
    }

    doSend(){
        this.progress.show("");        
        this.http.post(API_URI + "sendcode", this.forgotData).subscribe(res => {
            this.progress.dismiss();
            if(res.json().status == false){
                this.alert.show("Failed", res.json().error);
            }else{
                this.navCtrl.push(VerifyCodePage, {
                    email: this.forgotData.email
                });
            }
        });        
    }
}