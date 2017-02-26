import { Http } from '@angular/http';
import { Component } from '@angular/core';
import { MenuController, NavController, AlertController, Events } from 'ionic-angular';
import { API_URI } from '../../providers/config';
import { OtherProfilePage } from '../otherprofile/otherprofile';

@Component({
    templateUrl: "build/pages/account/account.html"   
})

export class AccountPage {
    accounts: any;
    user_type : number; 
    progress = false;
    step = 0;

    constructor(public navCtrl: NavController, public menuCtl: MenuController, public http: Http, public alertCtrl: AlertController, public events: Events){
        this.user_type = 0;
        let data = {
            user_type: 5,
            user_id: 2
        };        

        this.showProgress();
        this.http.post(API_URI + "getaccounts", data).subscribe(res => {
            this.hideProgress();
            if(res.json().status == false){
                let alert = this.alertCtrl.create({
                    title: "Failed",
                    subTitle: res.json().error,
                    buttons: ["OK"]
                });
                alert.present();
            }else{
                this.accounts = {
                    penddingaccounts: res.json().penddingaccounts,
                    activeaccounts: res.json().activeaccounts,
                    denyaccounts: res.json().denyaccounts,
                    deletedaccounts: res.json().deletedaccounts
                };         
                console.log(this.accounts);       
            }
        });

        this.events.subscribe('acceptaccount', (data) => {
            console.log("accept account");
            let d = JSON.parse(data[0]);
            let id = d.id;
            let type = d.type;
            let a = this.findAccount(type,id);  
            console.log(a);       
            if(a.type == 0){
                let start = this.accounts.penddingaccounts.applicants.indexOf(a);
                this.accounts.penddingaccounts.applicants.splice(start, 1);
                a.status = 1;
                this.accounts.activeaccounts.applicants.push(a);
            }else if(a.type == 1){
                let start = this.accounts.penddingaccounts.colleges.indexOf(a);
                this.accounts.penddingaccounts.colleges.splice(start, 1);
                a.status = 1;
                this.accounts.activeaccounts.colleges.push(a);
            }else if(a.type == 2){
                let start = this.accounts.penddingaccounts.highschools.indexOf(a);
                this.accounts.penddingaccounts.highschools.splice(start, 1);
                a.status = 1;
                this.accounts.activeaccounts.highschools.push(a);
            }else if(a.type == 3){
                let start = this.accounts.penddingaccounts.advertisers.indexOf(a);
                this.accounts.penddingaccounts.advertisers.splice(start, 1);
                a.status = 1;
                this.accounts.activeaccounts.advertisers.push(a);
            }else if(a.type == 4){
                let start = this.accounts.penddingaccounts.donors.indexOf(a);
                this.accounts.penddingaccounts.donors.splice(start, 1);
                a.status = 1;
                this.accounts.activeaccounts.donors.push(a);
            }else if(a.type == 5){
                let start = this.accounts.penddingaccounts.admins.indexOf(a);
                this.accounts.penddingaccounts.admins.splice(start, 1);
                a.status = 1;
                this.accounts.activeaccounts.admins.push(a);
            }         
        });

        this.events.subscribe('denyaccount', (data) => {
            console.log("deny account");
            let d = JSON.parse(data[0]);
            let id = d.id;
            let type = d.type;
            let a = this.findAccount(type, id);
            if(a.type == 0){
                let start = this.accounts.penddingaccounts.applicants.indexOf(a);
                this.accounts.penddingaccounts.applicants.splice(start, 1);
                a.status = 2;
                this.accounts.denyaccounts.applicants.push(a);
            }else if(a.type == 1){
                let start = this.accounts.penddingaccounts.colleges.indexOf(a);
                this.accounts.penddingaccounts.colleges.splice(start, 1);
                a.status = 2;
                this.accounts.denyaccounts.colleges.push(a);
            }else if(a.type == 2){
                let start = this.accounts.penddingaccounts.highschools.indexOf(a);
                this.accounts.penddingaccounts.highschools.splice(start, 1);
                a.status = 2;
                this.accounts.denyaccounts.highschools.push(a);
            }else if(a.type == 3){
                let start = this.accounts.penddingaccounts.advertisers.indexOf(a);
                this.accounts.penddingaccounts.advertisers.splice(start, 1);
                a.status = 2;
                this.accounts.denyaccounts.advertisers.push(a);
            }else if(a.type == 4){
                let start = this.accounts.penddingaccounts.donors.indexOf(a);
                this.accounts.penddingaccounts.donors.splice(start, 1);
                a.status = 2;
                this.accounts.denyaccounts.donors.push(a);
            }else if(a.type == 5){
                let start = this.accounts.penddingaccounts.admins.indexOf(a);
                this.accounts.penddingaccounts.admins.splice(start, 1);
                a.status = 2;
                this.accounts.denyaccounts.admins.push(a);
            }
        });
    }

    findAccount(type, id){
        var temp = null;
        if(this.accounts){            
            if(this.accounts.penddingaccounts){
                if(type == 0){
                    for(var i=0; i < this.accounts.penddingaccounts.applicants.length; i++){
                        if(this.accounts.penddingaccounts.applicants[i].id == id){
                            temp = this.accounts.penddingaccounts.applicants[i];
                        }
                    }
                }else if(type == 1){
                    for(var i=0; i < this.accounts.penddingaccounts.colleges.length; i++){
                        if(this.accounts.penddingaccounts.colleges[i].id == id){
                            temp = this.accounts.penddingaccounts.colleges[i];
                        }
                    }
                }else if(type == 2){
                    for(var i=0; i < this.accounts.penddingaccounts.highschools.length; i++){
                        if(this.accounts.penddingaccounts.highschools[i].id == id){
                            temp = this.accounts.penddingaccounts.highschools[i];
                        }
                    }
                }else if(type == 3){
                    for(var i=0; i < this.accounts.penddingaccounts.advertisers.length; i++){
                        if(this.accounts.penddingaccounts.advertisers[i].id == id){
                            temp = this.accounts.penddingaccounts.advertisers[i];
                        }
                    }
                }else if(type == 4){
                    for(var i=0; i < this.accounts.penddingaccounts.donors.length; i++){
                        if(this.accounts.penddingaccounts.donors[i].id == id){
                            temp = this.accounts.penddingaccounts.donors[i];
                        }
                    }
                }else if(type == 5){
                    for(var i=0; i < this.accounts.penddingaccounts.admins.length; i++){
                        if(this.accounts.penddingaccounts.admins[i].id == id){
                            temp = this.accounts.penddingaccounts.admins[i];
                        }
                    }
                }                
            }           
        }       

        return temp;
    }

    openMenu(){
        this.menuCtl.open();
    }

    goToOtherProfilePage(id){
        this.navCtrl.push(OtherProfilePage, {
            user_id: id
        });
    }

    settab(index){
        this.step = index;
    }

    changestatus(user, status){        
        if(status == 1){
            let alert = this.alertCtrl.create();
            alert.setTitle('Select Programs for this college');
            alert.addInput({
                type: 'checkbox',
                label: 'High School',
                value: 'hssp',
                checked: true
            });

            alert.addInput({
                type: 'checkbox',
                label: 'ASEP',
                value: 'asep',
                checked: false                
            });

            alert.addInput({
                type: 'checkbox',
                label: 'MAP',
                value: 'map',
                checked: true
            });

            alert.addButton({
                text: "OK",
                handler: data => {
                    let d = {
                        user_id : user.id,
                        hssp: false,
                        asep: false,
                        map: false
                    };
                   if(data.indexOf("hssp") != -1){
                       d.hssp = true;
                   }

                   if(data.indexOf("asep") != -1){
                       d.asep = true;
                   }

                   if(data.indexOf("map") != -1){
                       d.map = true;
                   }

                   this.showProgress();
                   this.http.post(API_URI + "acceptaccount", d).subscribe(res => {
                       this.hideProgress();
                       if(res.json().status == false){
                           console.log("api error");
                       }else{
                           user.status = 1;
                       }
                   }, err => {
                       let alert = this.alertCtrl.create({
                           title: "Failed",
                           subTitle: "please check internet connection",
                           buttons: ["OK"]
                       });
                       alert.present();
                   });
                }
            });
            alert.present();
        }else if(status == 2){
            this.showProgress();
            this.http.post(API_URI + "denyaccount", {
                user_id : user.id
            }).subscribe(res => {
                this.hideProgress();
                if(res.json().status == false){
                    console.log("api error");
                }else{
                    user.status = 2;
                }
            }, err => {
                let alert = this.alertCtrl.create({
                    title: "Failed",
                    subTitle: "please check internnet connection",
                    buttons: ['OK']
                });
            });
        }
    }

    showProgress(){
        this.progress = true;
    } 

    hideProgress(){
        this.progress = false;
    }
}