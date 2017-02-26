import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
    templateUrl: 'build/pages/profile/letter/letter.html'
})

export class LetterPage {
    constructor(public navCtrl: NavController){
        
    }

    goBack(){
        this.navCtrl.pop();
    }
}