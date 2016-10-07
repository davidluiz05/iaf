import { Component } from '@angular/core';
import { NavParams, ViewController, Events} from 'ionic-angular';

@Component({
    templateUrl: 'build/pages/message/list/morepop/morepop.html'
})

export class MorePopPage{   
    constructor(public ViewCtrl: ViewController, public navParams: NavParams, public events: Events){
        
    }
    
    setviewmode(mode){
        this.events.publish('messagelist:viewmode',mode);       
        this.ViewCtrl.dismiss();
    }
}