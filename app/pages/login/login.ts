import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import { ForgotPasswordPage } from '../forgot/sendcode/sendcode';
import { RegisterUserTypePage } from '../register/usertype/usertype';
import { HomePage } from '../home/home';
import { UserData } from '../../providers/user-data';
import { Alert } from '../../providers/alert';
import { Progress } from '../../providers/loading';
import { API_URI } from '../../providers/config';

@Component({
    templateUrl: 'build/pages/login/login.html',
    providers: [UserData, Alert, Progress]
})

export class LoginPage {
    private forgotPage : any;
    private registerPage : any;
    private homePage : any;
    private loginData: {email?: string, password?: string};
    
    constructor(public navCtrl: NavController, private userData: UserData, public http: Http, public alertCtrl: Alert, public progress: Progress){
        this.forgotPage = ForgotPasswordPage;
        this.registerPage = RegisterUserTypePage;
        this.homePage = HomePage;
        this.loginData = {
            email: '',
            password: ''
        };
    }

    doLogin(){
        this.progress.show("");               
        this.http.post(API_URI + "login", this.loginData).subscribe(res => {
            this.progress.dismiss();
            if(res.json().status == false){                
                this.alertCtrl.show("Login Failed", res.json().error);
            }else{
                this.userData.login({
                    full_name: res.json().full_name,
                    user_id: res.json().user_id,
                    profile_image: res.json().profile_image
                });
                this.navCtrl.setRoot(HomePage);
            }
        });
    }    
}