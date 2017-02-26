import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, ViewController, AlertController } from 'ionic-angular';
import { LoginPage } from '../../login/login';
import { UserData } from '../../../providers/user-data';
import { API_URI } from '../../../providers/config';

@Component({
    templateUrl: 'build/pages/profile/popmenu/popmenu.html',
    providers: [UserData]
})

export class ProfilePopMenu {
    constructor(public navCtrl: NavController, public viewCtrl: ViewController, public userData: UserData, public http: Http, public alertCtrl: AlertController){}

    delete(){        
        this.userData.getUserData().then((data) => {       
            let d = JSON.parse(data);     
            this.http.post(API_URI + "deleteaccount", {
                id: d.id
            }).subscribe(res => {
                if(res.json().status == false){                   
                    let alert = this.alertCtrl.create({
                        title: "Account Deleting Failed",
                        subTitle: res.json().error,
                        buttons: ["OK"]
                    });
                    alert.present();
                }else{                                       
                    this.viewCtrl.dismiss();
                    this.userData.logout();
                    this.navCtrl.setRoot(LoginPage);
                }
            })
        });
    }
}