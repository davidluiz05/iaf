import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';

@Component({
    templateUrl: "build/pages/splash/splash.html"
})

export class SplashPage {
    options = {
        pager: true
    };
    constructor(public navCtrl: NavController){

    }

    skip(){
        this.navCtrl.setRoot(LoginPage);
    }
}