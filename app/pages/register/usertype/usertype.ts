import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RegisterStep1Page } from '../step1/step1';

@Component({
    templateUrl: 'build/pages/register/usertype/usertype.html'   
})

export class RegisterUserTypePage {
    private type: any;    

    constructor(private navCtrl: NavController){
        this.type = 0;        
    }

    setType(type){
        this.type = type;        
    }

    goNext(){
        this.navCtrl.push(RegisterStep1Page, {
            type: this.type
        });
    }
}