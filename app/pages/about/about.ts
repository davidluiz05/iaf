import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { AboutSeg1Page} from './seg1/seg1';
import { AboutSeg2Page} from './seg2/seg2';
import { AboutSeg3Page} from './seg3/seg3';
import { AboutSeg4Page} from './seg4/seg4';

@Component({
    templateUrl: 'build/pages/about/about.html'
})

export class AboutPage {
    constructor(public navCtrl: NavController, public menuCtrl: MenuController){

    }

    openMenu(){
       this.menuCtrl.open();
    }

    goToSeg1Page(){
        this.navCtrl.push(AboutSeg1Page);
    }
    goToSeg2Page(){
        this.navCtrl.push(AboutSeg2Page);
    }
    goToSeg3Page(){
        this.navCtrl.push(AboutSeg3Page);
    }
    goToSeg4Page(){
        this.navCtrl.push(AboutSeg4Page);
    }
}