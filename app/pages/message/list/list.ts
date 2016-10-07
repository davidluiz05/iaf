import { Component } from '@angular/core';
import { NavController, MenuController, PopoverController, Events} from 'ionic-angular';
import { ChatPage } from '../chat/chat';
import { NewMessagePage } from '../new/new';
import { MessageSearchrPage } from '../search/search';
import { MorePopPage } from './morepop/morepop';
import { API_URI } from '../../../providers/config';
import { UserData } from '../../../providers/user-data';
import { Http } from '@angular/http';
import { Alert } from '../../../providers/alert';

@Component({
    templateUrl: 'build/pages/message/list/list.html',
    providers: [UserData, Alert]
})

export class MessageListPage {
    listmode: number;   
    messagelist: Array<any>;

    constructor(public navCtrl: NavController, public menuCtrl: MenuController, public popoverCtrl: PopoverController, public events: Events, public http: Http, public userData: UserData, public alert: Alert){
        this.listmode = 0;
        this.events.subscribe('messagelist:viewmode', (data)=> {
            this.listmode = data[0];
            this.getMessages(this.listmode);
        });
        this.getMessages(0);         
    }

    getMessages(mode){
        this.userData.getUserID().then((id) => {
            this.http.post(API_URI + "getmessagelist", {
                user_id: id,
                status: mode
            }).subscribe(res => {
                  if(res.json().status == false){
                      this.alert.show("Failed", res.json().error);
                  }else{
                      this.messagelist = res.json().messages;
                  }
            });
        }); 
    }

    goToChatPage(sender_id){
        this.navCtrl.push(ChatPage, {
            sender_id: sender_id
        });
    }

    goToNewMessagePage(){
        this.navCtrl.push(NewMessagePage);
    }

    goToSearchPage(){
        this.navCtrl.push(MessageSearchrPage);
    }

    openMenu(){
        this.menuCtrl.open();
    }

    showPopup(myEvent){
        let popover = this.popoverCtrl.create(MorePopPage);
        popover.present({
            ev: myEvent
        });
    }

    doArchive(message){
        this.http.post(API_URI + "markasread", {
            id: message.id,
            status: (this.listmode == 0?2:0)
        }).subscribe(res => {
            if(res.json().status == false){
                this.alert.show("Failed", res.json().error);
            }else{
                let start = this.messagelist.indexOf(message);
                this.messagelist.splice(start, 1);
            }
        });
    }
}