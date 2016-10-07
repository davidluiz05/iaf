import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import { HomePage } from '../../home/home';
import { UserData } from '../../../providers/user-data';
import { Progress } from '../../../providers/loading';
import { API_URI } from '../../../providers/config';

@Component({
    templateUrl: 'build/pages/register/step2/step2.html',
    providers: [UserData, Progress]
})

export class RegisterStep2Page {
    user_id: number;    
    step : number;

    answer1: number;
    answer2: Array<boolean>;
    answer3: number;
    answer4: number;

    constructor(private navCtrl: NavController, private userData: UserData, private http: Http,private progress: Progress){
        this.userData.getUserID().then(value => {
            this.user_id = value;            
        });
        this.step = 0;

        //initial answers
        this.answer1 = 0;
        this.answer2 = [false, false, false];
        this.answer3 = 0;
        this.answer4 = 0;
    }

    goPrev(){
        if(this.step > 0){
            this.step = this.step - 1;
        }
    }

    goNext(){
        if(this.step < 3){
            this.step = this.step + 1;
        }
    }

    select3(no){
        this.answer3 = no;
    }

    select4(no){
        this.answer4 = no;
    }

    doSend(){ 
        this.progress.show("");
        let data = {
            user_id: this.user_id,
            qa: JSON.stringify([this.answer1, this.answer2, this.answer3, this.answer4])
        };        
        this.http.post(API_URI + "postqas", data).subscribe(res => {
            this.progress.dismiss();
            if(res.json().status == true){
                this.navCtrl.setRoot(HomePage);
            }
        });
    }
}