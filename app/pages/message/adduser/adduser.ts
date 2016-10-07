import { Component } from '@angular/core';
import { NavController, Events, NavParams } from 'ionic-angular';
import { MessageFilterPage } from '../filter/filter';
import { Http } from '@angular/http';
import { Alert } from '../../../providers/alert';
import { Progress } from '../../../providers/loading';
import { UserData } from '../../../providers/user-data';
import { API_URI } from '../../../providers/config';

@Component({
    templateUrl: 'build/pages/message/adduser/adduser.html',
    providers: [UserData, Alert, Progress]
})

export class MessageAddUserPage {    
    private users: Array<any>;
    private idlist: Array<number>;
    private issearch: boolean;
    constructor(public navCtrl: NavController, public userData: UserData, public alert: Alert, public progress: Progress, private http: Http, public events: Events, public navParams: NavParams){
        this.issearch = false;
        this.idlist = this.navParams.get("idlist");
    }

    goBack(){
        this.navCtrl.pop();
    }

    goToFilterPage(){
        this.navCtrl.push(MessageFilterPage);
    }

    searchuser(event: any){        
        if(this.issearch == false){
            this.userData.getUserID().then(id => {
                this.issearch = true;
                let val = event.target.value;
                this.http.post(API_URI + "searchuser", {
                    tag: val,
                    id: id,
                    candidates: this.idlist
                }).subscribe(res => {
                    this.issearch = false;
                    if(res.json().status == false){
                        this.alert.show("Failed", res.json().error);
                    }else{
                        this.users = res.json().users;                    
                    }
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

}