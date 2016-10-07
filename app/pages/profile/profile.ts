import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { PopoverController } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import { ProfilePopMenu } from './popmenu/popmenu';
import { EditProfilePage } from './editprofile/editprofile';
import { UserData } from '../../providers/user-data';
import { Progress } from '../../providers/loading';
import { Alert } from '../../providers/alert';
import { Http } from '@angular/http';
import { Camera } from 'ionic-native';
import { API_URI, USERTYPE } from '../../providers/config';

@Component({
    templateUrl: 'build/pages/profile/profile.html',
    providers: [UserData, Alert, Progress]
})

export class ProfilePage {
    private data: any;  
    private types : Array<string>;  
    constructor(public navCtrl: NavController, public popoverCtrl: PopoverController, public menuCtrl: MenuController, public userData: UserData, private alert: Alert, private progress: Progress, public http: Http, public events: Events){        
        this.progress.show("");
        //init
        this.data = {
            first_name : "",
            last_name: "",
            profile_img: "img/user.png",
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
        //
        this.userData.getUserID().then(id => {

            this.http.post(API_URI + "getprofile", {
                id: id
            }).subscribe(res => {
                this.progress.dismiss();
                if(res.json().status == false){
                    this.alert.show("Failed", res.json().error);
                }else{
                    this.data = res.json().data;                    
                    this.data.profile_image = this.data.profile_image?this.data.profile_image:"img/user.png";
                    console.log(this.data);
                }                
            });
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

    changeStatus(status){
        this.progress.show("");        
        this.userData.getUserID().then(id => {           
            this.http.post(API_URI + "changestatus", {
                id: id,
                status: status
            }).subscribe(res => {
              this.progress.dismiss();
              if(res.json().status == false){
                  this.alert.show("Change Account Status", res.json().error);
              }else{
                  console.log("successfully changed");
                  this.data.status = status;
              } 
            });
        });        
    }

    setProfileImg(){              
        console.log("set profile image");
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
            this.progress.show("Uploading...");
            this.userData.getUserID().then(id => {
                this.http.post(API_URI + "uploaduserphoto",{
                    id: id,
                    data: imageData
                }).subscribe(res => {
                    this.progress.dismiss();
                    if(res.json().status == false){
                        this.alert.show("Photo uploading Failed", res.json().error);
                    }else{
                        this.data.profile_image = 'data:image/jpeg;base64,' + imageData;
                        this.events.publish('user:changephoto', this.data.profile_image);
                    }
                });
            });
        }, (err) =>{

        });
    }
}