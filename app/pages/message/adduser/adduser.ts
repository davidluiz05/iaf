import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, Events, NavParams, AlertController } from 'ionic-angular';
import { UserData } from '../../../providers/user-data';
import { API_URI } from '../../../providers/config';

@Component({
    templateUrl: 'build/pages/message/adduser/adduser.html',
    providers: [UserData]
})

export class MessageAddUserPage {    
    users: Array<any>;
    idlist: Array<number>;
    issearch: boolean;
    progress = false;

    constructor(public navCtrl: NavController, public userData: UserData, private http: Http, public events: Events, public navParams: NavParams, public alertCtrl: AlertController){
        this.issearch = false;
        this.idlist = this.navParams.get("idlist");
    }

    goBack(){
        this.navCtrl.pop();
    }

    goToFilterPage(){
        
    }

    searchuser(event: any){        
        if(this.issearch == false){
            this.userData.getUserData().then(data => {
                let d = JSON.parse(data);
                this.issearch = true;
                let val = event.target.value;
                this.showProgress();
                this.http.post(API_URI + "searchuser", {
                    tag: val,
                    id: d.id,
                    candidates: this.idlist
                }).subscribe(res => {
                    this.hideProgress();
                    this.issearch = false;
                    if(res.json().status == false){
                        let alert = this.alertCtrl.create({
                            title: "Failed",
                            subTitle: res.json().error,
                            buttons: ["OK"]
                        });
                        alert.present();
                    }else{
                        this.users = res.json().users;                    
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
    }

    adduser(user){
        console.log("add User");
        this.idlist.push(user.id); 
        this.events.publish('newmessage:adduser',user);      

        let start = this.users.indexOf(user);
        this.users.splice(start, 1);       
    }

    showProgress(){
        this.progress = true;
    } 

    hideProgress(){
        this.progress = false;
    }
}