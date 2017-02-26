import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, PopoverController, NavParams, AlertController, ModalController, Events} from 'ionic-angular';
import { OneSignal } from 'ionic-native';
import { TermsPage } from '../../terms/terms';
import { UserData } from '../../../providers/user-data';
import { API_URI } from '../../../providers/config';
import { EditProfilePage } from '../../profile/editprofile/editprofile';
import { ShowHideInput } from '../../../components/showhideinput';
import { StatesModalPage } from '../../../components/statesmodal/statesmodal';
import { HomePage } from '../../home/home';

@Component({
    templateUrl: 'build/pages/register/step1/step1.html',
    providers: [UserData],
    directives: [ShowHideInput]
})

export class RegisterStep1Page {
    progress = false;
    type: number;
    step: any;        
    data: {
        type?: number,
        first_name?: string,
        last_name?: string,
        middle_name?: string,
        state?: string,
        city?: string,
        zip?: string,
        address?: string,        
        email?: string,
        email_confirmation?: string,
        password?: string,
        password_confirmation?: string,
        applicant_type?: number,
        check_terms?: boolean,
        onesignal_code?: string,
        school_name?: string,
        job_title?: string,
        company_name?: string,
        phone?: string
    };

    constructor(private navCtrl: NavController, private navParams: NavParams, private http: Http, private userData: UserData, public alertCtrl: AlertController, public modalCtrl: ModalController, public events: Events){
        this.step = 0;                            
        this.data = {
            type: this.navParams.get('type'),
            first_name: null,
            last_name: null,
            middle_name: null,
            state: null,
            city: null,
            zip: null,
            address: null,
            email: null,
            email_confirmation: null,
            password: null,
            password_confirmation: null,
            applicant_type: 0,
            check_terms: false,
            onesignal_code: "123",
            school_name: null,
            job_title: null,
            company_name: null,
            phone: null
        };

        this.events.subscribe('selectedstate', (data) => {
            this.data.state = data[0];
        });        
    }

    nextStep(){
        this.step = this.step + 1;
        console.log(this.step);
    }

    goBack(){
        if(this.step <= 0){
            this.events.unsubscribe('selectedstate', ()=>{});            
            this.navCtrl.pop();
        }else{
            this.step = this.step - 1;
        }
    }

    goToTermsPage(){
        this.navCtrl.push(TermsPage);
    }

    doCreate(){  
        this.showProgress();        
        
        OneSignal.getIds().then((value)=>{    
            this.data.onesignal_code = value.userId;
            this.http.post(API_URI + "register", this.data).subscribe(res => {     
                this.hideProgress();           
                if(res.json().status == false){
                    let alert = this.alertCtrl.create({
                        title: 'Failed',
                        subTitle: res.json().error,
                        buttons: ['OK']
                    });
                    alert.present();
                }else{
                    this.userData.login(res.json());
                    this.navCtrl.setRoot(HomePage, { first: true});            
                }  
            }, err => {
                this.hideProgress();
                let alert = this.alertCtrl.create({
                    title: "Failed",
                    subTitle: "please check internnet connection",
                    buttons: ["OK"]
                });
                alert.present();
            });
        });
    }

    showstatedlg(){
        let modal = this.modalCtrl.create(StatesModalPage);
        modal.present();
    }

    showProgress(){
        this.progress = true;
    } 

    hideProgress(){
        this.progress = false;
    }
}