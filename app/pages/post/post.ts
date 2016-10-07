import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
    templateUrl: 'build/pages/post/post.html'
})

export class PostPage {
    constructor(public navCtrl: NavController){

    }

    doRefresh(ev){
        setTimeout(()=> {
            ev.complete();
        }, 2000);
    }

    doInfinite(ev){
        setTimeout(()=> {
            ev.complete();
        }, 2000);
    }
}