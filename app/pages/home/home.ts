import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import { UserData } from '../../providers/user-data';

@Component({
    templateUrl: 'build/pages/home/home.html',
    providers: [UserData]
})


export class HomePage {
    constructor(private navCtrl: NavController, private menuCtrl: MenuController, private userData: UserData){
        this.userData.hasLoggedIn().then((status) => {
            
        });       
    }

    openMenu(){
        console.log("Open menu Toggle");
        this.menuCtrl.open();
    }
}