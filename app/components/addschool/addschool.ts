import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, ModalController, AlertController, Events } from 'ionic-angular';
import { API_URI } from '../../providers/config';
import { StatesModalPage } from '../statesmodal/statesmodal';

@Component({
    templateUrl: "build/components/addschool/addschool.html"
})

export class AddSchoolPage {
    data: {
        schoolname?: string,
        state?: string,
        city?: string,
        name?: string,
        phone?: string,
        email?: string
    };
    progress = false;

    constructor(public navCtrl: NavController, public modalCtrl: ModalController, public alertCtrl: AlertController,public events: Events, public http: Http){
        this.data = {
            schoolname: null,
            state: null,
            city: null,
            name: null,
            phone: null,
            email: null
        };

        this.events.subscribe('selectedstate', (data) => {
            this.data.state = data[0];
        });

        this.events.subscribe('selectedcity', (data)=> {
            this.data.city = data[0].value;
        });

    }

    goBack(){
        this.events.unsubscribe('selectedstate', ()=>{});
        this.events.unsubscribe('selectedcity', ()=>{});
        this.navCtrl.pop();
    }

    showstatedlg(){
        let modal = this.modalCtrl.create(StatesModalPage);
        modal.present();
    }

    onSave(){
        this.showProgress();
        this.http.post(API_URI + "addhighschool", this.data).subscribe(res => {
            this.hideProgress();
            if(res.json().status == false){
                let alert = this.alertCtrl.create({
                    title: "Failed",
                    subTitle: res.json().error,
                    buttons: ["OK"]
                });
                alert.present();
            }else{
                console.log("School Creating success");
                this.events.publish('addschool', JSON.stringify({
                    id: res.json().school_id,
                    name: this.data.schoolname,
                    maincounselor: {
                        first_name: this.data.name,
                        last_name: " ",
                        email: this.data.email,
                        phone: this.data.phone
                    },
                    location: {
                        state: this.data.state,
                        city: this.data.city
                    }
                }));
                this.navCtrl.pop();
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

    showProgress(){
        this.progress = true;
    }

    hideProgress(){
        this.progress = false;
    }
}