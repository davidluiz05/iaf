import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, MenuController, AlertController, Events } from 'ionic-angular';
import { API_URI, SCHOLARSHIPTITLE} from '../../../providers/config';
import { UserData } from '../../../providers/user-data';
import { ApplicationApprovalPage } from '../approval/approval';
import { OtherProfilePage } from '../../../pages/otherprofile/otherprofile';

@Component({
    templateUrl: "build/pages/application/list/list.html",
    providers: [UserData]
})

export class ApplicationListPage {
    applications: Array<any>;
    namelist: Array<string>;
    type : number;
    progress = false;
    constructor(public navCtrl: NavController, public menuCtrl: MenuController, public http: Http, public userData: UserData, public alertCtrl: AlertController, public events: Events){
        this.namelist = SCHOLARSHIPTITLE;        
        this.userData.getUserData().then(data => {
            let d = JSON.parse(data);
            this.type = d.type;

            if(d.type == 0){
                this.showProgress();
                this.http.post(API_URI + "getapplicationsbyuser", {
                    user_id : d.id
                }).subscribe(res => { 
                    this.hideProgress();              
                    if(res.json().status == false){
                        let alert = this.alertCtrl.create({
                            title: "Failed",
                            subTitle: res.json().error,
                            buttons: ["OK"]
                        });
                        alert.present();
                    } else{
                        this.applications = res.json().applications;                        
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
            }else if(d.type == 1){
                this.showProgress();
                this.http.post(API_URI + "getapplicationsbycollege", {
                    college_id: d.college_id
                }).subscribe(res => {
                    this.hideProgress();
                    if(res.json().status == false){
                        let alert = this.alertCtrl.create({
                            title: "Failed",
                            subTitle: res.json().error,
                            buttons: ["OK"]
                        });
                        alert.present();
                    } else{
                        this.applications = res.json().applications;
                        console.log(this.applications);
                    }
                }, err => {
                    this.hideProgress();
                    let alert = this.alertCtrl.create({
                        title: "Failed",
                        subTitle: "please check internet connection",
                        buttons:["OK"]
                    });
                    alert.present();
                });
            }else if(d.type == 2){
                this.showProgress();
                this.http.post(API_URI + "getapplicationsbyschool", {
                    school_id: d.college_id
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
                        this.applications = res.json().applications;
                        console.log(this.applications);
                    }
                }, err => {
                    this.hideProgress();
                    let alert = this.alertCtrl.create({
                        title: "Failed",
                        subTitle: "please check internet connection",
                        buttons:["OK"]
                    });
                    alert.present();
                });
            }else{
                this.showProgress();
                this.http.post(API_URI + "getapplications",{}).subscribe(res => {
                    this.hideProgress();
                    this.applications = res.json().applications;
                }, err => {
                    this.hideProgress();
                    let alert = this.alertCtrl.create({
                        title: "Failed",
                        subTitle: "please check internet connection",
                        buttons:["OK"]
                    });
                    alert.present();
                });
            }
            
        });    

        this.events.subscribe('account:changestatus', (data) => {
            let d = JSON.parse(data[0]);
            for(var i = 0; i < this.applications.length; i++){
                if(this.applications[i].id == d.applicationid){
                    this.applications[i].status = d.status;
                }
            }
        });  
    }

    openMenu(){
        this.menuCtrl.open();
    }    

    showProgress(){
        this.progress = true;
    } 

    hideProgress(){
        this.progress = false;
    }

    goToOtherProfile(application){
        this.navCtrl.push(ApplicationApprovalPage, {user_id: application.user_id, applicationstatus: application.status ,applicationid: application.id, scholarshiptype: application.scholarship.availableto}); 
    }
}