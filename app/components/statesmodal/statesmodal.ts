import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, ViewController, Events, AlertController } from 'ionic-angular';
import { API_URI } from '../../providers/config';

@Component({
    templateUrl: 'build/components/statesmodal/statesmodal.html'
})

export class StatesModalPage {
    states: Array<string>;
    result: Array<string>;
    selected:string;
    progress = false;

    constructor(public navCtrl: NavController, public viewCtrl: ViewController, public events: Events, public alertCtrl: AlertController, public http: Http){
        this.states = [];
        this.selected = "";
        this.showProgress();
        this.http.post(API_URI + "getstates", {}).subscribe(res => {
            this.hideProgress();
            this.states = res.json().states;
            this.result = this.states;
        });
    }

    dismiss(){
        this.viewCtrl.dismiss();
    }

    done(){
        if(this.selected != ""){
            this.events.publish('selectedstate', this.selected);
            this.viewCtrl.dismiss();
        }else{
            let alert = this.alertCtrl.create({
                title: "Failed",
                subTitle: "please select a state",
                buttons: ["OK"]
            });
            alert.present();
        }       
    }

    select(sel){
        if(this.selected == sel){
            this.selected = "";
        }else{
            this.selected = sel;
        }        
    }

    showProgress(){
        this.progress = true;
    }

    hideProgress(){
        this.progress = false;
    }
}