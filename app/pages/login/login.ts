import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, AlertController } from 'ionic-angular';
import { OneSignal } from 'ionic-native';
import { ForgotPasswordPage } from '../forgot/sendcode/sendcode';
import { RegisterUserTypePage } from '../register/usertype/usertype';
import { HomePage } from '../home/home';
import { UserData } from '../../providers/user-data';
import { API_URI } from '../../providers/config';


@Component({
    templateUrl: 'build/pages/login/login.html',
    providers: [UserData]    
})

export class LoginPage {
    
    loginData: {email?: string, password?: string, onesignal_code?: string};
    progress = false;   
    
    constructor(public navCtrl: NavController, private userData: UserData, public http: Http, public alertCtrl: AlertController){        
        this.loginData = {
            email: 'john.cruyf@gmail.com',
            password: '12345678',
            onesignal_code: "123"            
        };       
    }   

    doLogin(){       
        this.showProgress();
        /*
        OneSignal.getIds().then((value)=>{
            this.loginData.onesignal_code = value.userId;*/
            this.http.post(API_URI + "login", this.loginData).subscribe(res => {    
                this.hideProgress();            
                if(res.json().status == false){                
                    let alert = this.alertCtrl.create({
                        title: "Failed",
                        subTitle: res.json().error,
                        buttons: ["OK"]
                    });
                    alert.present();
                }else{
                    this.userData.login(res.json());
                    this.navCtrl.setRoot(HomePage);
                }
            }, err => {
                let alert = this.alertCtrl.create({
                    title: "Failed",
                    subTitle: "please check internet connection",
                    buttons: ["OK"]
                });
                alert.present();
            });/*
        });*/
    }  

    create(){
        this.navCtrl.push(RegisterUserTypePage);
    }

    forgot(){
        this.navCtrl.push(ForgotPasswordPage);
    }

    showProgress(){
        this.progress = true;
    } 

    hideProgress(){
        this.progress = false;
    }
}