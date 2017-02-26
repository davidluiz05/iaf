import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { API_URI } from '../../../providers/config';
import { UserData } from '../../../providers/user-data';
import { Http } from '@angular/http';
import { CollegeSinglePage } from '../single/single';

@Component({
    templateUrl : "build/pages/colleges/list/list.html",
    providers: [UserData]
})

export class CollegeListPage {
    private colleges: Array<any>;
    constructor(public navCtrl: NavController, public menuCtrl: MenuController,public http: Http, public userData: UserData){
        this.userData.getUserData().then(data => {
            let x = JSON.parse(data);
            this.http.post(API_URI + "getcolleges", {
                user_id: x.id
            }).subscribe(res => {           
                this.colleges = res.json().schools;
            });
        });        
    }

    openMenu(){
        this.menuCtrl.open();
    }

    goToSinglePage(college){
        this.navCtrl.push(CollegeSinglePage, {
            college: college
        });
    }
}