import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MessagePopupPage } from '../messagepop/messagepop';
import { PopoverController } from 'ionic-angular';
import { API_URI } from '../../../providers/config';
import { UserData } from '../../../providers/user-data';
import { Alert } from '../../../providers/alert';
import { Http } from '@angular/http';

@Component({
    templateUrl: 'build/pages/message/chat/chat.html'
})

export class ChatPage {
    sender_id: number;
    messagelist: Array<any>;

    constructor(public navCtrl: NavController, public popoverCtrl: PopoverController, public alert: Alert, public userData: UserData, public http: Http, public navParams: NavParams){
        this.sender_id = this.navParams.get("sender_id");
        this.userData.getUserID().then((id) => {
            this.http.post(API_URI + "getmessagesbyid", {
                sender_id: this.sender_id,
                receiver_id: id
            }).subscribe(res => {
                if(res.json().status == false){
                    this.alert.show("Failed", res.json().error);
                }else{
                    this.messagelist = res.json().messages;
                }  
            });
        });
    }

    goBack(){
        this.navCtrl.pop();
    }

    showPopup(myEvent){
        let popover = this.popoverCtrl.create(MessagePopupPage);
        popover.present({
            ev: myEvent
        });
    }
}