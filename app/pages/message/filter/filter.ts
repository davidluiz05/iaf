import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
    templateUrl: 'build/pages/message/filter/filter.html'
})

export class MessageFilterPage {
    constructor(public navCtrl: NavController){

    }

    goBack(){
        this.navCtrl.pop();
    }
}