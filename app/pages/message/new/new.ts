import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, Events, AlertController} from 'ionic-angular';
import { MessageAddUserPage } from '../adduser/adduser';
import { API_URI } from '../../../providers/config';
import { UserData } from '../../../providers/user-data';


@Component({
    templateUrl: 'build/pages/message/new/new.html',
    providers: [UserData]
})

export class NewMessagePage {

    idlist: Array<number>;
    userlist: Array<any>;
    content: string;
    isAll: boolean;
    progress = false;

    constructor(public navCtrl: NavController, public events: Events, public userData: UserData, public http: Http, public alertCtrl: AlertController){
        this.userlist = []; 
        this.idlist = [];     
        this.isAll = false;
        this.content = "";

        this.events.subscribe('newmessage:adduser', (data)=>{
            this.userlist.push(data[0]);            
        }); 
    }

    goBack(){
        this.events.unsubscribe('newmessage:adduser', ()=>{});
        this.navCtrl.pop();
    }

    goToAddUserPage(){
        this.navCtrl.push(MessageAddUserPage , {            
            idlist: this.idlist
        });
    }

    deleteCandidate(user){
        let start = this.idlist.indexOf(user.id);
        this.idlist.splice(start, 1);

        start = this.userlist.indexOf(user);
        this.userlist.splice(start, 1);
    }

    sendMessage(){        
        this.showProgress();
        if(this.content.trim() != "" && this.idlist.length != 0){                    
            this.userData.getUserData().then(data => {
                let d = JSON.parse(data);
                this.http.post(API_URI + "createmessage",{
                    sender_id: d.id,
                    receiver_ids: this.idlist,
                    content: this.content.trim()
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
                        this.content = "";
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
            });
        }         
    }

    showProgress(){
        this.progress = true;
    }

    hideProgress(){
        this.progress = false;
    }
}