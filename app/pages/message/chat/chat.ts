import { Component, NgZone} from '@angular/core';
import { Http } from '@angular/http';
import { NavController, NavParams, Events, AlertController } from 'ionic-angular';
import { MessagePopupPage } from '../messagepop/messagepop';
import { OtherProfilePage } from '../../otherprofile/otherprofile';
import { PopoverController } from 'ionic-angular';
import { API_URI } from '../../../providers/config';
import { UserData } from '../../../providers/user-data';
import { Angular2AutoScroll } from '../../../providers/auto-scroll';

@Component({    
    templateUrl: 'build/pages/message/chat/chat.html',   
    providers: [UserData],
    directives: [Angular2AutoScroll]    
})

export class ChatPage {
    sender_id: number;
    messagelist: Array<any>;
    sender: any;
    receiver: any;
    messagecontent: string; 
    zone: any; 

    constructor(public navCtrl: NavController, public popoverCtrl: PopoverController, public userData: UserData, public http: Http, public navParams: NavParams, public events: Events, public alertCtrl: AlertController){
        this.sender_id = this.navParams.get("sender_id");  
        this.zone = new NgZone({enableLongStackTrace: false});      
        this.userData.getUserData().then((data) => {
            let d = JSON.parse(data);
            this.http.post(API_URI + "getmessagesbyid", {
                sender_id: this.sender_id,
                receiver_id: d.id
            }).subscribe(res => {
                if(res.json().status == false){
                    let alert =  this.alertCtrl.create({
                        title: "Failed",
                        subTitle: res.json().error,
                        buttons: ["OK"]
                    });
                    alert.present();
                }else{
                    this.messagelist = res.json().messages;
                    this.sender = res.json().sender;
                    this.receiver = res.json().receiver;
                }  
            }, err => {
                let alert =  this.alertCtrl.create({
                    title: "Failed",
                    subTitle:"please check internet connection",
                    buttons: ["OK"]
                });
                alert.present();
            });
        }); 

       this.events.subscribe('chat:receive', (data)=>{           
           var jsonData = JSON.parse(data[0]);           
           var receiver_ids = jsonData.additionalData.receiver_ids.split(",");           
           var sender_id = jsonData.additionalData.sender_id;           
           this.userData.getUserData().then((data) => {
               let d = JSON.parse(data);
               if(receiver_ids.indexOf(d.id) != -1 && this.sender_id == sender_id){
                   this.zone.run(()=>{
                        this.messagelist.push({
                                content:jsonData.message,
                                created_at: new Date(),
                                sender_id: sender_id
                        });
                    });
               }
           });                  
        });
        

        this.events.subscribe('otherprofile:view', (data) => {
            let user_id = data[0];
            this.navCtrl.push(OtherProfilePage, {
                user_id: user_id
            });
        });
    }

    goBack(){
        this.events.unsubscribe('chat:receive', () => {});
        this.events.unsubscribe('otherprofile:view', ()=>{});
        this.navCtrl.pop();
    }

    showPopup(myEvent){
        let popover = this.popoverCtrl.create(MessagePopupPage, {
            user_id: this.sender_id
        });
        popover.present({
            ev: myEvent
        });
    }

    sendMessage(){        
        if(this.messagecontent.trim() !=""){
            this.userData.getUserData().then(data => {
                let d = JSON.parse(data);
                this.http.post(API_URI + "createmessage",{
                    sender_id: d.id,
                    receiver_ids: [this.sender_id],
                    content: this.messagecontent.trim()
                }).subscribe(res => {
                    if(res.json().status == false){
                        let alert = this.alertCtrl.create({
                            title: "Failed",
                            subTitle: res.json().error,
                            buttons: ["OK"]
                        });
                        alert.present();
                    }else{
                        this.messagelist.push({
                            content: this.messagecontent,
                            created_at: new Date()
                        });                        
                        this.messagecontent = "";                                             
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
    }       
}