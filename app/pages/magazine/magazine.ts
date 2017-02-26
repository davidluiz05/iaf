import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { InAppBrowser} from 'ionic-native';
import { NavController, MenuController, AlertController } from 'ionic-angular';
import { API_URI } from '../../providers/config';
import { UserData } from '../../providers/user-data';
import { MagazineCreatePage } from './create/create';

@Component({
    templateUrl: 'build/pages/magazine/magazine.html'
})

export class MagazinePage {
    magazines : Array<any>;
    page : number;
    nums: number;
    enableMore: boolean;   
    progress = false;
    canCreate = false;

    constructor(public navCtrl: NavController, public menuCtrl: MenuController, public http: Http, public alertCtrl: AlertController, public userData: UserData){
        //initialize
        this.magazines = [];
        this.page = 0;
        this.nums = 10;
        this.enableMore = false;

        this.userData.getUserData().then(data => {
            let d = JSON.parse(data);
            if(d.type == 5){
                this.canCreate =  true;
            }
        });

        this.showProgress();
        this.http.post(API_URI + "getmagazines", {
            page: this.page,
            nums: this.nums
        }).subscribe(res => {
            this.hideProgress();
            this.magazines = res.json().magazines;
            if(this.magazines.length >= this.nums){
                this.enableMore = true;
            }
        });
    }

    doRefresh(ev){
        this.page = 0;
        this.http.post(API_URI + "getmagazines", {
            page: this.page,
            nums: this.nums
        }).subscribe(res => {
            this.magazines = res.json().magazines;
            if(this.magazines.length >= this.nums){
                this.enableMore = true;
            }else{
                this.enableMore = false;
            }

            ev.complete();
        }, err => {
            this.hideProgress();
            let alert = this.alertCtrl.create({
                title: "Failed",
                subTitle: "please check internet connection",
                buttons: ["OK"]
            });
            alert.present();
        });
    }

    doInfinite(ev){
        this.page = this.page + 1;
        this.http.post(API_URI + "getmagazines", {
            page: this.page,
            nums: this.nums
        }).subscribe(res => {
            var i = 0;
            for(i = 0; i <res.json().magazines.length; i++){
                this.magazines.push(res.json().magazines[i]);
            }
            console.log(i);
            if(i > this.nums){
                this.enableMore = true;
            }else{
                this.enableMore = false;
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

    openMenu(){
        this.menuCtrl.open();
    }

    openPDF(url){
        InAppBrowser.open(url,"_self");
    }

    showProgress(){
        this.progress = true;
    } 

    hideProgress(){
        this.progress = false;
    }

    create(){
        this.navCtrl.push(MagazineCreatePage);
    }
}