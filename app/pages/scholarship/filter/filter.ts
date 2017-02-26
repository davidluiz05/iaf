import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';

@Component({
    templateUrl: "build/pages/scholarship/filter/filter.html"
})

export class ScholarshipFilterPage {
    constructor(public navCtrl: NavController, public viewCtrl: ViewController){

    }

    cancel(){
        this.viewCtrl.dismiss();
    }

    apply(){
        this.viewCtrl.dismiss();
    }
}