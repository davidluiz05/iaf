import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import { API_URI } from '../../../providers/config';
import { UserData } from '../../../providers/user-data';
import { Progress } from '../../../providers/loading';
import { Alert } from '../../../providers/alert';
import { ProfilePage } from '../../profile/profile';

@Component({
    templateUrl: 'build/pages/profile/editprofile/editprofile.html',
    providers: [UserData, Alert, Progress]
})

export class EditProfilePage{

    step: any;
    data: {
        id?: number,
        type?: number,
        first_name?: string,
        last_name?: string,
        middle_name?: string,        
        state?: string,
        city?: string,
        zip?: string,
        address?: string,           
        phone?:  string,
        email?: string,
        email_confirmation?: string,
        password?: string,
        password_confirmation?: string       
    };

    constructor(public navCtrl: NavController, public http: Http, public userData: UserData, public alert: Alert,public progress: Progress){
        this.step = 0;

        this.data = {
            id: null,
            type: 0,
            first_name: null,
            last_name: null,
            middle_name: null,            
            state: null,
            city: null,
            zip: null,
            address: null,
            phone: null,
            email: null,
            email_confirmation: null,
            password: null,
            password_confirmation: null            
        };

        this.progress.show("Loading data...");
        this.userData.getUserID().then(id => {
            this.http.post(API_URI + "getprofile", {
                id: id
            }).subscribe(res => {
                this.progress.dismiss();
                if(res.json().status == false){
                    this.alert.show("Failed", res.json().error);
                }else{
                    this.data = res.json().data;
                    this.data.state = res.json().data.additional_data.location.state;
                    this.data.city = res.json().data.additional_data.location.city;
                    this.data.zip = res.json().data.additional_data.location.zip;
                    this.data.address = res.json().data.additional_data.location.address;
                    this.data.email_confirmation = this.data.email;
                }
            });
        });        
    }

    goToStep(step){
        this.step = step;
    }

    doSave(){
        this.progress.show("");
        this.userData.getUserID().then(id => {
            this.data.id = id;
            this.http.post(API_URI + "updateprofile", this.data).subscribe(res => {
                this.progress.dismiss();
                if(res.json().status == false){
                    this.alert.show("Failed",  res.json().error);
                }else{
                    
                }
            });
        });
    }
}