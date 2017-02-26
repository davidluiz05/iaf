import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, NavParams, Events, AlertController } from 'ionic-angular';
import { API_URI,SCHOLARSHIPSTATUS, APPLICANTTYPE, SCHOLARSHIPTITLE } from '../../../providers/config';
import { OtherProfilePage } from '../../otherprofile/otherprofile';
import { UserData } from '../../../providers/user-data';
import { ApplicationSinglePage } from '../../../pages/application/single/single';

@Component({
    templateUrl: "build/pages/scholarship/single/single.html",
    providers: [UserData]
})

export class ScholarshipSinglePage {    
    scholarship: any;
    applications : Array<any>;
    status: Array<string>;
    applicanttypes: Array<string>;
    namelist: Array<string>;
    canApply: boolean;
    progress = false;

    constructor(public navCtrl:NavController, public navParams: NavParams, public events: Events, public http: Http, public alertCtrl: AlertController, public userData: UserData){        
        
        this.status = SCHOLARSHIPSTATUS;
        this.applicanttypes = APPLICANTTYPE;  
        this.namelist = SCHOLARSHIPTITLE;
        this.canApply = false;
        this.showProgress();
        this.userData.getUserData().then((data) => {
            let d =JSON.parse(data);
           if(d.type == 0){
               this.canApply = true;
           }
        });
        this.http.post(API_URI + "getscholarship", {
            scholarship_id: this.navParams.get("scholarship_id")
        }).subscribe(res => {
            this.hideProgress();
            if(res.json().status == false){
                let alert = this.alertCtrl.create({
                    title: "Failed",
                    subTitle: res.json().error,
                    buttons: ["OK"]
                });
                alert.present();
            }else{
                this.scholarship = res.json().scholarship;                
            }
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

    goBack(){
        this.navCtrl.pop();
    }   

    goToUserDetailPage(id){
        this.navCtrl.push(OtherProfilePage, {
            user_id: id
        });
    }

    startapplication(){
        this.navCtrl.push(ApplicationSinglePage, {
            scholarship: this.scholarship
        });
    }

    showProgress(){
        this.progress = true;
    }

    hideProgress(){
        this.progress = false;
    }
}