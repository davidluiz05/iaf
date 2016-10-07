import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { MessageAddUserPage } from '../adduser/adduser';
import { API_URI } from '../../../providers/config';
import { Http } from '@angular/http';
import { UserData } from '../../../providers/user-data';
import { Alert } from '../../../providers/alert';

@Component({
    templateUrl: 'build/pages/message/new/new.html',
    providers: [UserData, Alert]
})

export class NewMessagePage {

    idlist: Array<number>;
    userlist: Array<any>;
    content: string;
    isAll: boolean;

    constructor(public navCtrl: NavController, public events: Events, public userData: UserData, public http: Http, public alert: Alert){
        this.userlist = []; 
        this.idlist = [];     
        this.isAll = false;
        this.content = "";

        this.events.subscribe('newmessage:adduser', (data)=>{
            this.userlist.push(data[0]);
            console.log(this.userlist);
            console.log(this.idlist);
        }); 
    }

    goBack(){
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
        if(this.content.trim() != "" && this.idlist.length != 0){  
            console.log("new message");          
            this.userData.getUserID().then(id => {
                this.http.post(API_URI + "createmessage",{
                    sender_id: id,
                    receiver_ids: this.idlist,
                    content: this.content.trim()
                }).subscribe(res => {
                    if(res.json().status == false){
                        this.alert.show("Failed", res.json().error);
                    }else{
                        this.content = "";
                    }
                });
            });
        }         
    }
}