import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
    templateUrl: 'build/pages/terms/terms.html'
})

export class TermsPage {
    constructor(public navCtrl: NavController){

    }

    goBack(){
        this.navCtrl.pop();
    }
}