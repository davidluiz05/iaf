import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
    templateUrl: 'build/pages/post/single/single.html'
})

export class SinglePostPage {
    private data: any;
    constructor(public  navCtrl: NavController, public navParams: NavParams){
        this.data = this.navParams.get('post');
    }

    goBack(){
        this.navCtrl.pop();
    }
}