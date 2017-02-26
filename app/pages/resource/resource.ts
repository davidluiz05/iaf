import { Component } from '@angular/core';
import { NavController,MenuController, AlertController } from 'ionic-angular';
import { API_URI } from '../../providers/config';
import { Http } from '@angular/http';
import { UserData } from '../../providers/user-data';

@Component({
    templateUrl: 'build/pages/resource/resource.html',
    providers: [UserData]
})

export class ResourcePage {
    resources: Array<any>;
    progress = false;

    constructor(public navCtrl: NavController, public menuCtrl: MenuController, public http: Http, public alertCtrl: AlertController, public userData: UserData){
        
        this.showProgress();
        this.userData.getUserData().then(data => {
            let d =  JSON.parse(data);
            this.http.post(API_URI + "getresources", {
                user_id: d.id
            }).subscribe(res => {
                this.hideProgress();
                if(res.json().status == false){
                    let alert = this.alertCtrl.create({
                        title: 'Failed',
                        subTitle: res.json().error,
                        buttons: ["OK"]
                    });
                    alert.present();
                }else{
                    this.resources = res.json().resources;
                }                
            }, err => {
                this.hideProgress();
                let alert =  this.alertCtrl.create({
                    title: "Failed",
                    subTitle: "please check internet connection",
                    buttons: ["OK"]
                });
                alert.present();
            });
        });        
    }

    openMenu(){
        this.menuCtrl.open();
    }

    showProgress(){
        this.progress = true;
    }

    hideProgress(){
        this.progress =  false;
    }
}