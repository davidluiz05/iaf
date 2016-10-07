import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import {  LoginPage } from '../../login/login';
import { UserData } from '../../../providers/user-data';
import { Http } from '@angular/http';
import { Progress } from '../../../providers/loading';
import { Alert } from '../../../providers/alert';
import { API_URI } from '../../../providers/config';

@Component({
    templateUrl: 'build/pages/profile/popmenu/popmenu.html',
    providers: [UserData, Alert, Progress]
})

export class ProfilePopMenu {
    constructor(public navCtrl: NavController, public viewCtrl: ViewController, public userData: UserData, public http: Http, public alert: Alert, public progress: Progress){}

    delete(){
        this.progress.show("");
        this.userData.getUserID().then((id) => {            
            this.http.post(API_URI + "changestatus", {
                id: id,
                status: 2
            }).subscribe(res => {
                if(res.json().status == false){
                    this.alert.show("Deleting account",res.json().error);
                }else{
                    this.alert.show("Success", "Just deleted your account successfully");
                    this.userData.logout();
                    this.viewCtrl.dismiss();
                    this.navCtrl.setRoot(LoginPage);
                }
            })
        });
    }

    signout(){
        this.viewCtrl.dismiss();
        this.userData.logout();        
        this.navCtrl.setRoot(LoginPage);
    }
}