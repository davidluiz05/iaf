import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, Events, PopoverController,MenuController, AlertController } from 'ionic-angular';
import { Camera, InAppBrowser } from 'ionic-native';
import { ProfilePopMenu } from './popmenu/popmenu';
import { EditProfilePage } from './editprofile/editprofile';
import { UserData } from '../../providers/user-data';
import { API_URI, USERTYPE } from '../../providers/config';
import { LetterPage } from './letter/letter';

@Component({
    templateUrl: 'build/pages/profile/profile.html',
    providers: [UserData]
})

export class ProfilePage {
    data: any;  
    types : Array<string>;  
    progress = false;

    constructor(public navCtrl: NavController, public popoverCtrl: PopoverController, public menuCtrl: MenuController, public userData: UserData, public alertCtrl: AlertController, public http: Http, public events: Events){
        //init
        this.data = {
            first_name : "",
            last_name: "",
            profile_image: "img/user.png",
            additional_data: {
                location: {
                    city: "",
                    state: ""
                }
            },
            type: 0,
            status: 0
        };
        this.types = USERTYPE;
        
        this.showProgress();
        this.userData.getUserData().then(data => {
            let d = JSON.parse(data);

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
        });

        this.events.subscribe('user:saveprofile', (data)=> {
            this.data.first_name = data[0].first_name;
            this.data.last_name = data[0].last_name;
            if(this.data.type != 5){
                this.data.additional_data.location.city = data[0].city;
                this.data.additional_data.location.state = data[0].state;
            }            
        });
    }

    showPopup(myEvent){
        let popover = this.popoverCtrl.create(ProfilePopMenu);
        popover.present({
            ev: myEvent
        });
    }

    openMenu(){
        this.menuCtrl.open();
    }

    goToEditProfilePage(){
        this.navCtrl.push(EditProfilePage);
    }   

    setProfileImg(){
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
                this.http.post(API_URI + "uploaduserphoto",{
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
                        this.data.profile_image = 'data:image/jpeg;base64,' + imageData;
                        this.events.publish('user:changephoto', this.data.profile_image);
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
        }, (err) =>{

        });
    }

    showProgress(){
        this.progress = true;
    }

    hideProgress(){
        this.progress = false;
    }

    showLetterPage(){
        //this.navCtrl.push(LetterPage);
        InAppBrowser.open("http://192.168.3.228/IAF/public/img/1.png", "_self");
    }

    showCertificate(){
        InAppBrowser.open("http://192.168.3.228/IAF/public/img/1.pdf", "_self");
    }
    
}