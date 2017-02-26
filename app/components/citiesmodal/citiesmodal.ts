import { Component } from '@angular/core';
import { NavController, ViewController, Events, NavParams, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { API_URI } from '../../providers/config';

@Component({
    templateUrl: 'build/components/citiesmodal/citiesmodal.html'
})

export class CitiesModalPage {
    cities: Array<any>;
    selected:string;
    states: Array<string>;
    progress = false;
    tag : string;
    result : Array<string>;

    constructor(public navCtrl: NavController, public viewCtrl: ViewController, public events: Events, public alertCtrl: AlertController, public http: Http, public navParams: NavParams){
        this.cities = [];
        this.selected = "";
        this.states = this.navParams.get('states');
        this.showProgress();
        this.http.post(API_URI + "getcities", {
            states: this.states
        }).subscribe(res => {
            this.hideProgress();
            if(res.json().status == true){
                 this.cities = res.json().cities;
                 this.result = this.cities;
            }else{
                let alert = this.alertCtrl.create({
                    title: 'Failed',
                    subTitle: res.json().error,
                    buttons: ["OK"]
                });
                alert.present();
            }           
        }, err => {
            this.hideProgress();
            let alert = this.alertCtrl.create({
                title: "Failed",
                subTitle: "please check internet connection",
                buttons: ["OK"]
            });
            alert.present();
        });
    }

    dismiss(){
        this.viewCtrl.dismiss();
    }

    done(){
        if(this.selected != ""){
            this.events.publish('selectedcity', this.selected);
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

    search(event){
        this.result = this.cities.filter((item) => {
            return item.value.toLowerCase().indexOf(this.tag.toLowerCase()) > -1;
        })
    }
}