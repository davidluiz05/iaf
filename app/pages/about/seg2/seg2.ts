import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
    templateUrl: 'build/pages/about/seg2/seg2.html'
})

export class AboutSeg2Page {
    constructor(public navCtrl: NavController){

    }

    goBack(){
        this.navCtrl.pop();
    }
}