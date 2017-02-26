import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Camera } from 'ionic-native';
import { NavController, ModalController, AlertController} from 'ionic-angular';
import { API_URI } from '../../../providers/config';
import { UserData } from '../../../providers/user-data';
import { ProfilePage } from '../../profile/profile';
import { Events, NavParams} from 'ionic-angular';
import { SchoolSelectPage } from '../../../components/schoolselect/schoolselect';
import { StatesModalPage } from '../../../components/statesmodal/statesmodal';

@Component({
    templateUrl: 'build/pages/profile/editprofile/editprofile.html',
    providers: [UserData]
})

export class EditProfilePage{
    progress = false;
    step: any;
    first: boolean;
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
        gender?: boolean,
        email?: string,
        email_confirmation?: string,
        password?: string,
        password_confirmation?: string,
        additional_data?: {
            applicant_type?: number,
        },
        branch_service?: string,
        military_status?: string,
        date_discharge?: string,
        school_id?: number,
        school_name?: string,
        school_state?: string,
        school_city?: string,
        school_counselor?: string,
        school_phone?: string,
        school_email?: string,
        applicant_type?: number,
        college_description?: string,
        hssp_enrolled?: boolean,
        asep_enrolled?: boolean,
        map_enrolled?: boolean,
        college_logo?: string,
        program_id?: number,
        program_type?: number,
        projected_start?: string,
        projected_graduation?: string,
        guardion_first_name?: string,
        guardion_last_name?: string,
        guardion_email?: string,
        have_highschool?: boolean,
        highschool_graduation?: string,
        job_title?: string
    };

    constructor(public navCtrl: NavController, public http: Http, public userData: UserData, public alertCtrl: AlertController, public events: Events, public modalCtrl: ModalController, public navParams: NavParams){
        this.step = 0;
        if(this.navParams.get('first')){
            this.first = true;
        }
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
            gender: true,
            phone: null,
            email: null,
            email_confirmation: null,
            password: null,
            password_confirmation: null,
            additional_data: {
                applicant_type: null
            },
            branch_service: null,
            military_status: null,
            date_discharge: null,
            school_id: null,
            school_name: "",
            applicant_type: null,
            college_description: null,
            asep_enrolled: false,
            map_enrolled: false,
            hssp_enrolled: false,
            program_id: null,
            program_type: null,
            projected_start: null,
            projected_graduation: null,
            guardion_email: null,
            guardion_first_name: null,
            guardion_last_name: null,
            have_highschool: false,
            highschool_graduation: null,
            school_counselor: null,
            school_email: null,
            school_phone: null,
            school_city: null,
            school_state: null,
            job_title: null
        };        

        this.showProgress();    
        this.userData.getUserData().then(data => {
            let d = JSON.parse(data);
            this.data.type = d.type;
            if(this.data.type == 0){
                this.data.applicant_type = d.applicant_type;
            }
            this.http.post(API_URI + "getprofile", {
                id: d.id
            }).subscribe(res => {      
                this.hideProgress();          
                if(res.json().status == false){
                    let alert = this.alertCtrl.create({
                        title: "Failed",
                        subTitle: res.json().error,
                        buttons: ["OK"]
                    });
                    alert.present();
                }else{
                    this.data = res.json().data;
                    this.data.email_confirmation = this.data.email;
                    if(this.data.type != 5){
                        this.data.state = res.json().data.additional_data.location.state;
                        this.data.city = res.json().data.additional_data.location.city;
                        this.data.zip = res.json().data.additional_data.location.zip;
                        this.data.address = res.json().data.additional_data.location.address;
                    }                                    
                   
                    if(this.data.type == 0){
                        this.data.applicant_type = this.data.additional_data.applicant_type;
                        this.data.program_id = res.json().data.additional_data.program_id;
                        this.data.program_type = res.json().data.additional_data.program_type;
                        this.data.projected_start = res.json().data.additional_data.projected_start;
                        if(!this.data.projected_start){
                            this.data.projected_start = (new Date()).toJSON();
                        }
                        this.data.projected_graduation = res.json().data.additional_data.projected_graduation;
                        if(!this.data.projected_graduation){
                            this.data.projected_graduation = (new Date()).toJSON();
                        }
                        if(this.data.applicant_type == 0){
                            if(res.json().data.additional_data.school){
                                this.data.school_name = res.json().data.additional_data.school.name;
                                this.data.school_id = res.json().data.additional_data.school.id;
                                this.data.school_counselor  = res.json().data.additional_data.school.maincounselor.first_name + res.json().data.additional_data.school.maincounselor.last_name;
                                this.data.school_state = res.json().data.additional_data.school.location.state;
                                this.data.school_city = res.json().data.additional_data.school.location.city;
                                this.data.school_email = res.json().data.additional_data.school.maincounselor.email;
                                this.data.school_phone = res.json().data.additional_data.school.maincounselor.phone;
                            }                         
                            this.data.guardion_first_name = res.json().data.additional_data.guardion_first_name;
                            this.data.guardion_last_name = res.json().data.additional_data.guardion_last_name;
                            this.data.guardion_email = res.json().data.additional_data.guardion_email;
                        }else if(this.data.applicant_type == 1){
                            if(res.json().data.additional_data.school){
                                this.data.school_name = res.json().data.additional_data.school.name;
                                this.data.school_id = res.json().data.additional_data.school.id;
                                this.data.school_counselor  = res.json().data.additional_data.school.maincounselor.first_name + res.json().data.additional_data.school.maincounselor.last_name;
                                this.data.school_state = res.json().data.additional_data.school.location.state;
                                this.data.school_city = res.json().data.additional_data.school.location.city;
                                this.data.school_email = res.json().data.additional_data.school.maincounselor.email;
                                this.data.school_phone = res.json().data.additional_data.school.maincounselor.phone;
                            }
                            this.data.have_highschool = res.json().data.additional_data.have_highschool;
                            this.data.highschool_graduation = res.json().data.additional_data.highschool_graduation;
                            if(!this.data.highschool_graduation){
                                this.data.highschool_graduation = (new Date()).toJSON();
                            }
                        }else{
                            this.data.branch_service = res.json().data.additional_data.service_branch;
                            this.data.military_status = res.json().data.additional_data.military_status;
                            this.data.date_discharge = res.json().data.additional_data.discharge_date;
                        }                       
                    }else if(this.data.type == 1) {
                        this.data.college_description = res.json().data.additional_data.description;
                        this.data.hssp_enrolled = res.json().data.additional_data.hssp_enrolled;
                        this.data.asep_enrolled = res.json().data.additional_data.asep_enrolled;
                        this.data.map_enrolled = res.json().data.additional_data.map_enrolled;
                        this.data.college_logo = res.json().data.additional_data.header_image;
                        this.data.job_title = res.json().data.additional_data.job_title;
                        this.data.school_name = res.json().data.additional_data.name;
                    }else if(this.data.type == 2){
                        this.data.school_name = res.json().data.additional_data.name;
                    }
                    console.log(this.data);                  
                }
            }, err => {
                this.hideProgress();
                let alert =  this.alertCtrl.create({
                    title: "Failed",
                    subTitle: "please check internet connection",
                    buttons: ["OK"]
                });
                alert.present();
            });
        });        

        this.events.subscribe('selectedschool', (data) => {
            console.log("selected school event");
            let d = JSON.parse(data[0]);
            console.log(d);
            this.data.school_id = d.id;
            this.data.school_name = d.name;
            this.data.school_counselor  = d.maincounselor.first_name + d.maincounselor.last_name;
            this.data.school_state = d.location.state;
            this.data.school_city = d.location.city;
            this.data.school_email = d.maincounselor.email;
            this.data.school_phone = d.maincounselor.phone;
        });

        this.events.subscribe('selectedstate', (data) => {
            this.data.state = data[0];
        });
    }

    goToStep(step){
        this.step = step;
    }

    doSave(){
        this.showProgress();
        this.userData.getUserData().then(data => {
            let d = JSON.parse(data);

            this.data.id = d.id;
            this.http.post(API_URI + "updateprofile", this.data).subscribe(res => {  
                this.hideProgress();              
                if(res.json().status == false){
                    let alert = this.alertCtrl.create({
                        title: "Failed",
                        subTitle: res.json().error,
                        buttons: ["OK"]
                    });
                    alert.present();
                }else{
                    this.events.publish('user:changename', this.data.first_name + " " + this.data.last_name);
                    this.events.publish('user:saveprofile',{
                        first_name: this.data.first_name,
                        last_name: this.data.last_name,
                        city: this.data.city,
                        state: this.data.state,
                        type: this.data.type
                    });

                    this.navCtrl.setRoot(ProfilePage);
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
        });
    }

    showSchoolSelectDlg(){
        console.log("modal dialog show");
        let modal = this.modalCtrl.create(SchoolSelectPage);
        modal.present();
    }

    updatecollegelogo(){
        let options = {
            quality: 75,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 300,
            targetHeight: 300,
            saveToPhotoAlbum: false
        };

        Camera.getPicture(options).then((imageData) => {
            this.showProgress();
            this.userData.getUserData().then(data => {
                let d = JSON.parse(data);
                this.http.post(API_URI + "uploadcollegephoto", {
                    id: d.id,
                    data: imageData
                }).subscribe(res => {
                    this.hideProgress();
                    if(res.json().status == false){
                        let alert = this.alertCtrl.create({
                            title: "Failed",
                            subTitle: res.json().error,
                            buttons: ["OK"]
                        });
                        alert.present();
                    }else{
                        this.data.college_logo = 'data:image/jpeg;base64,' + imageData;
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
            });
        });
    }

    setgender(status){
        this.data.gender = status;
    }

    sethavehighschool(status){
        this.data.have_highschool = status;
    }


    goBack(){
        this.events.unsubscribe('selectedschool', ()=>{});
        this.events.unsubscribe('selectedstate', ()=>{});
        this.events.unsubscribe('selectedcity', ()=>{});
        this.navCtrl.pop();
    }

    showProgress(){
        this.progress = true;
    }

    hideProgress(){
        this.progress = false;
    }

    showstatedlg(){
        let modal = this.modalCtrl.create(StatesModalPage);
        modal.present();
    }
}