import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ViewController } from 'ionic-angular';

@Component({
    templateUrl: 'build/pages/message/messagepop/messagepop.html'
})

export class MessagePopupPage{
    constructor(public navCtrl: NavController, public viewCtrl: ViewController){

    }

    closePopup(){
        this.viewCtrl.dismiss();
    }
}