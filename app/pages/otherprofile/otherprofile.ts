import  { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, NavParams, AlertController, PopoverController, Events} from 'ionic-angular';
import { API_URI, USERTYPE, APPLICANTTYPE, ACCOUNTSTATUS } from '../../providers/config';

@Component({
    templateUrl: 'build/pages/otherprofile/otherprofile.html'
})

export class OtherProfilePage {
    data: any;
    types: Array<string>;
    applicanttypes: Array<string>;
    accountstatus: Array<string>;
    progress = false;
    hssp_enrolled: boolean;
    asep_enrolled: boolean;
    map_enrolled: boolean;

    constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public alertCtrl: AlertController, public popoverCtrl: PopoverController, public events: Events){
        this.data = null;
        this.types = USERTYPE; 
        this.applicanttypes = APPLICANTTYPE;   
        this.accountstatus = ACCOUNTSTATUS;   
        this.hssp_enrolled = false;
        this.asep_enrolled = false;
        this.map_enrolled = false;

        this.showProgress();       
        this.http.post(API_URI + "getprofile", {
            id: this.navParams.get('user_id')
        }).subscribe(res => {
            console.log(res.json());
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
                this.data.profile_image = this.data.profile_image?this.data.profile_image:"img/user.png";                
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

    showProgress(){
        this.progress = true;
    }

    hideProgress(){
        this.progress = false;
    }    

    accept(){
        if(this.hssp_enrolled || this.asep_enrolled || this.map_enrolled || this.data.type != 1) {
            console.log("accepted 1");
            let d = {
                user_id: this.data.id,
                hssp: this.hssp_enrolled,
                asep: this.asep_enrolled,
                map: this.map_enrolled
            }
            this.http.post(API_URI + "acceptaccount", d).subscribe(res => {
                if(res.json().status == false){
                    console.log("error");
                }else{
                    this.navCtrl.pop();
                    this.events.publish('acceptaccount', JSON.stringify({
                        id: this.data.id,
                        type: this.data.type
                    }));
                }
            });
        }else{
            console.log("show alert");
            let alert = this.alertCtrl.create({
                title: "Failed",
                subTitle: "please select at least one scholarship program",
                buttons: ["OK"]
            });
            alert.present();
        }
    }

    deny(){
        console.log("denied");
        this.http.post(API_URI + "denyaccount",
        {
            user_id: this.data.id
        }).subscribe(res => {
            if(res.json().status == false){
                console.log("api error");
            }else{
                this.navCtrl.pop();
                this.events.publish('denyaccount', JSON.stringify({
                    id: this.data.id,
                    type: this.data.type
                }));
            }
        });
    }
}