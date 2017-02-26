import { Component, NgZone } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, ViewController, Events, AlertController } from 'ionic-angular';
import { API_URI } from '../../providers/config';
import { SchoolFilterPage } from './filter/filter';
import { AddSchoolPage } from '../../components/addschool/addschool';

@Component({
    templateUrl: "build/components/schoolselect/schoolselect.html"
})

export class SchoolSelectPage {
    schools: Array<any>;
    selected: number;    
    selectedname : string;

    states: Array<any>;
    cities: Array<any>; 
    progress = false;  
    zone: any;


    constructor(public navCtrl: NavController, public viewCtrl: ViewController, public http: Http, public events: Events, public alertCtrl: AlertController){

        this.selected = null;             
        this.schools = [];
        this.states = [];
        this.cities = [];   
        this.zone = new NgZone({enableLongStackTrace: false});        

        this.events.subscribe('selectedschoolfilter', ()=> {
            
            this.http.post(API_URI + "gethighschools", {
                states: this.states,
                cities: this.cities               
            }).subscribe(res => {
                if(res.json().status == false){
                    let alert = this.alertCtrl.create({
                        title: "Failed",
                        subTitle: res.json().error,
                        buttons: ["OK"]
                    });
                    alert.present();
                }else{
                    this.schools = res.json().schools;
                }                
            }, err => {
                let alert = this.alertCtrl.create({
                    title: "Failed",
                    subTitle: "please check internet connection",
                    buttons: ["OK"]
                });
                alert.present();
            });
        });

        this.events.subscribe('addschool' , (data) => {
            let d = JSON.parse(data[0]);
            this.zone.run(()=>{
                this.schools.push(d);
            });            
        });
    }

    done(){        
        if(this.selected != null){
            this.events.publish('selectedschool', JSON.stringify(this.selected));
        }

        this.events.unsubscribe('selectedschoolfilter', ()=>{});
        this.viewCtrl.dismiss();
    }      

    filter(){
        this.navCtrl.push(SchoolFilterPage, {
            states: this.states,
            cities: this.cities            
        });
    }

    select(school){
        if(this.selected == school){
            this.selected = null;
        }else{
            this.selected = school;
        }        
    }

    goToAddSchoolPage(){
        this.navCtrl.push(AddSchoolPage);
    }

    showProgress(){
        this.progress = true;
    }

    hideProgress(){
        this.progress = false;
    }
};