import { Component } from '@angular/core';
import { NavController, ModalController, Events, NavParams, AlertController } from 'ionic-angular';
import { StatesModalPage } from '../../statesmodal/statesmodal';
import { CitiesModalPage } from '../../citiesmodal/citiesmodal';

@Component({
    templateUrl: 'build/components/schoolselect/filter/filter.html'
})

export class SchoolFilterPage {
    private states: Array<string>;
    private cities: Array<string>;
    
    constructor(public navCtrl: NavController, public modalCtrl: ModalController, public events: Events, public alertCtrl: AlertController, public navParams: NavParams){
        this.states = this.navParams.get('states');
        this.cities = this.navParams.get('cities');       

        this.events.subscribe('selectedstate', (data) => {
            let start = this.states.indexOf(data[0]);
            if(start == -1){
                this.states.push(data[0]);
            }
            
        });        
    }

    cancel(){
        this.events.unsubscribe('selectedstate',()=>{});        
        this.navCtrl.pop();
    }

    apply(){
        if(this.states.length || this.cities.length){
            this.events.publish('selectedschoolfilter');
            this.events.unsubscribe('selectedstate',()=>{});      
            this.navCtrl.pop();
        }else{
            let alert = this.alertCtrl.create({
                title: "Failed",
                subTitle: "please select at least a state or a city",
                buttons: ["OK"]
            });
            alert.present();
        }        
    }

    openStatesModal(){       
        let modal = this.modalCtrl.create(StatesModalPage);
        modal.present();
    }

    openCitiesModal(){        
        let prompt = this.alertCtrl.create({
            title: "Add a city",
            message: "please enter city name",
            inputs: [
                {
                    name: 'city'
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },

                {
                    text: 'Save',
                    handler: data => {
                        if(data.city){
                            console.log(data.city);
                             let flag = false;
                            for(var i = 0; i < this.cities.length; i++){
                                if(this.cities[i] == data.city){
                                    flag = true;
                                }
                            }

                            if(flag == false){
                                this.cities.push(data.city);
                                console.log(this.cities);
                            }
                        }
                    }
                }
            ]
        });
        prompt.present();
    }    

    deletestate(state){
        let start = this.states.indexOf(state);
        this.states.splice(start, 1);
    }

    deletecity(city){
        let start = this.cities.indexOf(city);
        this.cities.splice(start, 1);
    } 

}