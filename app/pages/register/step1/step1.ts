import { Component } from '@angular/core';
import { NavController, PopoverController, NavParams} from 'ionic-angular';
import { Http } from '@angular/http';
import { RegisterStep2Page } from '../step2/step2';
import { TermsPage } from '../../terms/terms';
import { UserData } from '../../../providers/user-data';
import { StateList } from '../../../providers/states-data';
import { Alert } from '../../../providers/alert';
import { Progress } from '../../../providers/loading';
import { API_URI } from '../../../providers/config';

@Component({
    templateUrl: 'build/pages/register/step1/step1.html',
    providers: [StateList, Alert, Progress, UserData]
})

export class RegisterStep1Page {
    step: any;
    nextPage: any;
    termsPage: any;   
    statelist: any;
    data: {
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
        password_confirmation?: string,
        applicant_type?: number,
        check_terms?: boolean
    };

    constructor(private navCtrl: NavController, private navParams: NavParams, private stateList: StateList, private http: Http, private alert: Alert, private progress: Progress, private userData: UserData){
        this.step = 0;        
        this.termsPage = TermsPage;
        this.statelist = this.stateList.getStateList();
        this.data = {
            type: this.navParams.get('type'),
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
            password_confirmation: null,
            applicant_type: 0,
            check_terms: false
        };
    }

    nextStep(){
        this.step = this.step + 1;
        console.log(this.step);
    }

    goBack(){
        if(this.step <= 0){
            this.navCtrl.pop();
        }else{
            this.step = this.step - 1;
        }
    }

    goToTermsPage(){
        this.navCtrl.push(TermsPage);
    }

    doCreate(){        
        this.progress.show("Creating an account...");        
        this.http.post(API_URI + "register", this.data).subscribe(res => {
            this.progress.dismiss();
            if(res.json().status == false){
                this.alert.show("Registration Failed", res.json().error);
            }else{
                this.userData.login({
                    full_name: res.json().full_name,
                    user_id: res.json().user_id,
                    profile_img: res.json().profile_img
                });
                this.navCtrl.setRoot(RegisterStep2Page);
            }  
        });               
    }    
}