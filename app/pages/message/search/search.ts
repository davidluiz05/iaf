import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
    templateUrl: 'build/pages/message/search/search.html'
})

export class MessageSearchrPage {
    constructor(public navCtrl: NavController){

    }

    goBack(){
        this.navCtrl.pop();
    }
    
}