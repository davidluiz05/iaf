import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { API_URI, APPLICANTTYPE, ACCOUNTSTATUS, SCHOLARSHIPTITLE } from '../../../providers/config';

@Component({
    templateUrl: 'build/pages/application/approval/approval.html'
})

export class ApplicationApprovalPage {
    data : any;
    progress = false;
    applicanttypes: Array<string>;
    accountstatus: Array<string>;
    applicationid: number;
    scholarshiptype: number;
    scholarshiptitle: Array<string>;
    applicationstatus: number;

    constructor(public navCtrl: NavController, public http: Http, public navParams: NavParams, public alertCtrl: AlertController, public events: Events){
        this.data = null;
        this.applicanttypes = APPLICANTTYPE;
        this.accountstatus = ACCOUNTSTATUS;
        this.applicationid = this.navParams.get('applicationid');
        this.scholarshiptype = this.navParams.get('scholarshiptype');
        this.scholarshiptitle = SCHOLARSHIPTITLE;
        this.applicationstatus = this.navParams.get('applicationstatus');
        
        this.showProgress();
        this.http.post(API_URI + "getprofile", {
            id: this.navParams.get('user_id')
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
                this.data = res.json().data;
                this.data.profile_image = this.data.profile_image?this.data.profile_image:"img/user.png"; 
                console.log(this.data);               
            }
        }, err => {
            this.hideProgress();
            let alert = this.alertCtrl.create({
                title: "Failed",
                subTitle: "please check internet connection.",
                buttons: ["OK"]
            });
            alert.present();
        });
    }

    showProgress(){
        this.progress = true;
    }

    hideProgress(){
        this.progress = false;
    }

    goBack(){
        this.navCtrl.pop();
    }

    accept(){
        this.showProgress();
        this.http.post(API_URI + "acceptapplication",
        {
            id: this.applicationid,
            type : this.data.type
        }).subscribe(res => {
            this.hideProgress();
            if(res.json().status == false){
                let alert = this.alertCtrl.create({
                    title: "Failed",
                    subTitle: res.json().error,
                    buttons:["OK"]
                });
                alert.present();
            }else{
                if(this.data.type == 2){
                    this.events.publish('account:changestatus', JSON.stringify({
                        applicationid: this.applicationid,
                        status: 2
                    }));
                }else{
                    this.events.publish('account:changestatus', JSON.stringify({
                        applicationid: this.applicationid,
                        status: 7
                    }));                    
                }
                this.navCtrl.pop();            
            }
        });
    }

    deny(){
        this.showProgress();
        this.http.post(API_URI + "rejectapplication",
        {
            id: this.applicationid
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
                this.events.publish('account:changestatus', JSON.stringify({
                        applicationid: this.applicationid,
                        status: 8
                    }));
                this.navCtrl.pop();
            }
        });
    }
}