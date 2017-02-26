
import { Component } from '@angular/core';
import { NavController, AlertController} from 'ionic-angular';
import { Http } from '@angular/http';
import { API_URI } from '../../../providers/config';
import { UserData } from '../../../providers/user-data';
import { ApplicationListPage } from '../../../pages/application/list/list';

@Component({
    templateUrl: 'build/pages/application/servey/servey.html',
    providers: [UserData]
})

export class ServeyPage {
    step: number;
    data: Array<any>;
    answers: Array<number>;
    progress = false;

    constructor(public navCtrl: NavController, public http: Http, public alertCtrl: AlertController, public userData: UserData){
        this.step = 0;
        this.answers = [];
        this.data =[];
        for(var i = 0;i < 37; i++){
            this.answers[i] = 0;
        }
        this.http.get(API_URI + "getallquestions").subscribe(res => {
            this.data = res.json().qa;
        }, err => {
            let alert = this.alertCtrl.create({  
                title: "Failed",
                subTitle: "please check internet connection",
                buttons: ["OK"]
            });
            alert.present();
        });
    }

    prev(){
        this.step = this.step - 1;
    }

    next(){
        if(this.step < 36){
            this.step = this.step + 1;
        }else{
            this.showProgress();
            this.userData.getUserData().then((data) => {
                let d = JSON.parse(data);
                this.http.post(API_URI + "postqas", {
                    user_id: d.id,
                    answers: this.answers
                }).subscribe(res => {
                    if(res.json().status == false){
                        let alert = this.alertCtrl.create({
                            title: "Failed",
                            subTitle: res.json().error,
                            buttons: ["OK"]
                        });
                        alert.present();
                    }else{
                        this.navCtrl.setRoot(ApplicationListPage);
                    }
                }, err => {
                    let alert = this.alertCtrl.create({
                        title: "Failed",
                        subTitle: "please check internet connection",
                        buttons: ["OK"]
                    });
                    alert.present();
                });
            });
        }
    }

    setval(index, val){
        this.answers[index] = val;
    }

    showProgress(){
        this.progress = true;
    }

    hideProgress(){
        this.progress = false;
    }
}