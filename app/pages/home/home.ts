import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import { UserData } from '../../providers/user-data';
import { MessageListPage } from '../message/list/list';
import { PostPage } from '../post/post';
import { AccountPage } from '../account/account';
import { ScholarshipListPage } from '../scholarship/list/list';
import { ApplicationSinglePage } from '../application/single/single';
import { CollegeListPage } from '../colleges/list/list';
import { ApplicationListPage } from '../application/list/list';
import { API_URI } from '../../providers/config';
import { Http } from '@angular/http';
import { AlertController } from 'ionic-angular';
import { EditProfilePage } from '../profile/editprofile/editprofile';

@Component({
    templateUrl: 'build/pages/home/home.html',
    providers: [UserData]
})


export class HomePage {
    private type: number;
    private data: any;

    constructor(private navCtrl: NavController, public menuCtrl: MenuController, public userData: UserData, public http: Http, public alertCtrl: AlertController, public navParams:NavParams){
         this.type = 5;

         if(this.navParams.get('first') == true){
             let confirm = this.alertCtrl.create({
                title: "Congratulations",
                message: "Please click 'Agree' to complete your profile information",
                buttons: [
                    {
                        text: 'Agree',
                        handler: () => {
                            this.navCtrl.setRoot(EditProfilePage, {first: true});
                        }
                    }
                ]
            }); 
            confirm.present();
         }         
         
         
         this.userData.getUserData().then(data => {
             let x = JSON.parse(data);             
             this.type =x.type;
             
             this.http.post(API_URI + "getdashboard", {
                 user_id: x.id,
                 type: x.type,
                 date: '2016-11-14'
             }).subscribe(res => {
                 if(res.json().status == false){
                     let alert = this.alertCtrl.create({
                         title: "Failed",
                         subTitle: res.json().error,
                         buttons: ['ok']
                     });
                     alert.present();
                 }else{
                     this.data = res.json().data;
                 }
             });
         }, err => {
             let alert = this.alertCtrl.create({
                 title: "Failed",
                 subTitle: "please check internet connection",
                 buttons: ["OK"]
             });
             alert.present();
         });
    }

    openMenu(){
        console.log("Open menu Toggle");
        this.menuCtrl.open();
    }

    goToMessagePage(){
        this.navCtrl.push(MessageListPage);
    }

    goToSchoolList(){
        this.navCtrl.push(AccountPage);
    }

    goToApplication(){
        this.navCtrl.push(ApplicationListPage);
    }

    goToPostPage(){
        this.navCtrl.push(PostPage);
    }

    goToAccountsPage(){
        this.navCtrl.push(AccountPage);
    }

    goToDonation(){

    }

    goToStudentPage(){
        
    }

    goToScholarshipPage(){
        this.navCtrl.push(ScholarshipListPage);
    }

    goToAdvertiserPage(){

    }

    startapplicantion(){
        this.navCtrl.push(ApplicationSinglePage);
    }
}