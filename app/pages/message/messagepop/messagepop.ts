import { Component } from '@angular/core';
import { NavController, NavParams, Events} from 'ionic-angular';
import { ViewController } from 'ionic-angular';

@Component({
    templateUrl: 'build/pages/message/messagepop/messagepop.html'
})

export class MessagePopupPage{
    constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, public events: Events){

    }

    closePopup(){
        this.viewCtrl.dismiss();
    }

    goToOtherProfilePage(){
        this.viewCtrl.dismiss();
        this.events.publish('otherprofile:view', this.navParams.get('user_id'));
    }
}