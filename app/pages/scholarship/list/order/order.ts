import { Component } from '@angular/core';
import { ViewController, Events } from 'ionic-angular';

@Component({
    templateUrl: 'build/pages/scholarship/list/order/order.html'
})

export class ScholarshipOrderPage{
    constructor(public viewCtrl: ViewController, public events: Events){}

    set(value){
        this.viewCtrl.dismiss();
        this.events.publish('scholarship:setordervalue', value);
    }
}
