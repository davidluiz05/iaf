import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, MenuController, PopoverController, Events, AlertController} from 'ionic-angular';
import { ChatPage } from '../chat/chat';
import { NewMessagePage } from '../new/new';
import { MorePopPage } from './morepop/morepop';
import { API_URI } from '../../../providers/config';
import { UserData } from '../../../providers/user-data';


@Component({
    templateUrl: 'build/pages/message/list/list.html',
    providers: [UserData]
})

export class MessageListPage {
    listmode: number;   
    messagelist: Array<any>;

    constructor(public navCtrl: NavController, public menuCtrl: MenuController, public popoverCtrl: PopoverController, public events: Events, public http: Http, public userData: UserData, public alertCtrl: AlertController){
        this.listmode = 0;
        this.events.subscribe('messagelist:viewmode', (data)=> {
            this.listmode = data[0];
            this.getMessages(this.listmode);
        });
        this.getMessages(0);         
    }

    getMessages(mode){
        this.userData.getUserData().then((data) => {
            let d = JSON.parse(data);
            console.log(d);
            this.http.post(API_URI + "getmessagelist", {
                user_id: d.id,
                status: mode
            }).subscribe(res => {
                  if(res.json().status == false){
                      let alert = this.alertCtrl.create({
                          title: "Failed",
                          subTitle: res.json().error,
                          buttons: ["OK"]
                      });
                      alert.present();
                  }else{
                      this.messagelist = res.json().messages;
                  }
            }, err =>{
                let alert = this.alertCtrl.create({
                    title: "Failed",
                    subTitle: "please check internet connection",
                    buttons: ["OK"]
                });
                alert.present();
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
        this.userData.getUserData().then((data) => {
            let d = JSON.parse(data);
            this.http.post(API_URI + "markmessage", {
                user_id: message.sender_id,
                status: (this.listmode == 0?2:0)
            }).subscribe(res => {
                if(res.json().status == false){
                    let alert =  this.alertCtrl.create({
                        title: "Failed",
                        subTitle: res.json().error,
                        buttons: ["OK"]
                    });
                    alert.present();
                }else{
                    let start = this.messagelist.indexOf(message);
                    this.messagelist.splice(start, 1);
                }
            }, err => {
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