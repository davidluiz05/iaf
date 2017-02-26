import { Component } from '@angular/core';
import { NavController, NavParams, AlertController} from 'ionic-angular';
import { Http } from '@angular/http';
import { API_URI } from '../../../providers/config';

@Component({
    templateUrl: "build/pages/colleges/single/single.html"
})

export class CollegeSinglePage {
    private college: any;
    private countscholarships: number;

    constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public alertCtrl: AlertController){
        this.college = this.navParams.get('college');
        this.countscholarships = 0;
        this.http.post(API_URI + "getcountscholarship", {
            college_id: this.college.id
        }).subscribe(res => {
            if(res.json().status == false){
                let alert = this.alertCtrl.create({
                    title: "Failed",
                    subTitle: res.json().error,
                    buttons: ["OK"]
                });
                alert.present();
            }else{
                this.countscholarships = res.json().count;
            }
        }, err => {
            let alert = this.alertCtrl.create({
                title: "Failed",
                subTitle: "please check internet connection",
                buttons: ["OK"]
            });
            alert.present();
        });
    }

    goBack(){
        this.navCtrl.pop();
    }
}