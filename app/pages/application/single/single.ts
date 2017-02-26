import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController,ModalController, Events, NavParams, AlertController} from 'ionic-angular';
import { Camera } from 'ionic-native';
import { UserData } from '../../../providers/user-data';
import { API_URI, SCHOLARSHIPTITLE } from '../../../providers/config';
import { TermsPage } from '../../terms/terms';
import { ServeyPage } from '../../application/servey/servey';
import { ApplicationListPage } from '../../application/list/list';

@Component({
    templateUrl: "build/pages/application/single/single.html",
    providers: [UserData]
})

export class ApplicationSinglePage {  
    progress = false;  
    scholarship: any;
    title: string;
    type: number;
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
        phone?: string,
        email?: string,
        email_confirmation?: string,
        applicant_type?: number,
        service_branch?: string,
        military_status?: string,
        discharge_date?: string,
        graduation_date_between?: boolean,
        is_over?: boolean,
        user_id?: number
        guidance_counselor?: string,
        check_terms?: boolean,
        scholarship_id?: number
    };
    constructor(public navCtrl: NavController, public modalCtrl: ModalController, public userData: UserData, public events: Events, public http: Http, public navParam: NavParams, public alertCtrl: AlertController){
        this.scholarship = this.navParam.get('scholarship');
        console.log(this.scholarship);
        this.userData.getUserData().then((data) => {
            let d = JSON.parse(data);
            this.type = this.scholarship.availableto[0];
            this.title = SCHOLARSHIPTITLE[this.scholarship.availableto[0]];

            this.showProgress();
            this.http.post(API_URI + "getprofile", {
                id: d.id
            }).subscribe(res => {
                this.hideProgress();
                this.data = res.json().data;
                this.data.state = res.json().data.additional_data.location.state;
                this.data.city = res.json().data.additional_data.location.city;
                this.data.zip = res.json().data.additional_data.location.zip;
                this.data.address = res.json().data.additional_data.location.address;
                this.data.email_confirmation = this.data.email;
                this.data.user_id = d.id;
                this.data.scholarship_id = this.scholarship.id;
                this.data.type = this.type;
                this.data.is_over = true;
                this.data.guidance_counselor = "";
                this.data.check_terms = false;
                this.data.graduation_date_between = false;
                this.data.applicant_type = this.scholarship.availableto[0];
                if(res.json().data.additional_data.applicant_type == 2){
                    this.data.service_branch = res.json().data.additional_data.service_branch;
                    this.data.military_status = res.json().data.additioanl_data.mililtary_status;
                    this.data.discharge_date = res.json().data.additional_data.discharge_date;
                }                
            console.log(this.data);
            }, err => {
                this.hideProgress();
                let alert = this.alertCtrl.create({
                    title: "Failed",
                    subTitle: "please check internet connection",
                    buttons: ["OK"]
                });
                alert.present();
            });
        });
    }

    submit(){
        this.showProgress();
        this.http.post(API_URI + "createapplication", this.data).subscribe(res => {
            this.hideProgress();
            if(res.json().status == false){
                let alert = this.alertCtrl.create({
                    title: "Failed",
                    subTitle: res.json().error,
                    buttons: ["OK"]
                });
                alert.present();
            }else{
                if(this.type == 1){
                    this.navCtrl.push(ServeyPage);
                }else{
                    this.navCtrl.setRoot(ApplicationListPage);
                }                
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

    goBack(){
        this.navCtrl.pop();
    }

    goToTermsPage(){
        this.navCtrl.push(TermsPage);
    }

    showProgress(){
        this.progress = true;
    } 

    hideProgress(){
        this.progress = false;
    }

    toggleIsOver(state){
        this.data.is_over = state;
    }
}