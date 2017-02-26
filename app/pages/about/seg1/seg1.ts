import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
    templateUrl: 'build/pages/about/seg1/seg1.html'
})

export class AboutSeg1Page {
    constructor(public navCtrl: NavController){

    }

    goBack(){
        this.navCtrl.pop();
    }
}