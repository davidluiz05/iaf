import { Component, Pipe, PipeTransform } from '@angular/core';
import { NavController, MenuController, ModalController, PopoverController, Events } from 'ionic-angular';
import { Http } from '@angular/http';
import { API_URI, SCHOLARSHIPTITLE} from '../../../providers/config';
import { ScholarshipSinglePage } from '../single/single';
import { UserData } from '../../../providers/user-data';
import { ScholarshipOrderPage } from './order/order';

@Pipe({
    name: 'searchName',
    pure: false
})

export class SearchNamePipe  implements PipeTransform {
    transform(scholarships: any[], params: string){
        if(scholarships == null){
            return null;
        }
        if(params == ''){
            return scholarships;
        }
        let query = params.toLowerCase();
        console.log(query);
        return scholarships.filter(d => d.college.name.toLowerCase().indexOf(query) > -1);
    } 
}

@Component({
    templateUrl: 'build/pages/scholarship/list/list.html',
    providers: [UserData],
    pipes: [SearchNamePipe]
})

export class ScholarshipListPage {
    private scholarships: Array<any>;
    private namelist = SCHOLARSHIPTITLE;
    private page: number;
    private nums: number;
    private enableMore: boolean;   
    private applicant_type: number; 
    private step: number;
    private orderValue: number;
    private orderCandidates = ["Status", "College"];
    private statusCandidates = ["Open to apply", "Close to apply"];
    private tag: string;
    

    constructor(public navCtrl: NavController, public menuCtrl: MenuController, public http: Http, public userData: UserData, public modalCtrl: ModalController, public popoverCtrl: PopoverController, public events: Events){

        //initialize
        this.scholarships = [];
        this.page = 0;
        this.nums = 8;
        this.enableMore = false;   
        this.step = 0;
        this.orderValue = 0;
        this.tag = "";

        this.userData.getUserData().then((data) => {
            let d = JSON.parse(data);
            this.applicant_type = d.applicant_type;
            var sendData = null;

            if(d.type == 1){
               sendData = {
                    college_id : d.college_id,
                    page: this.page,
                    nums: this.nums
                }
            }else{
                sendData = {
                    page: this.page,
                    nums: this.nums
                };
            }
            this.http.post(API_URI + "getallscholarships", sendData).subscribe(res => {
                if(res.json().status == true){                    
                    this.scholarships = res.json().scholarships; 
                    console.log(this.scholarships);               
                    if(this.scholarships.length >= this.nums){
                        this.enableMore = true;
                    }
                }else{

                }
            });
        });     

        this.events.subscribe('scholarship:setordervalue', (data) => {
            this.orderValue = data[0];
            this.http.post(API_URI + "getallscholarships", { 
                order: this.orderValue,
                page: this.page,
                nums: this.nums
            }).subscribe(res => {
                if(res.json().status == true){                    
                    this.scholarships = res.json().scholarships; 
                    console.log(this.scholarships);               
                    if(this.scholarships.length >= this.nums){
                        this.enableMore = true;
                    }
                }else{

                }
            });
        });                
    }

    openMenu(){
        this.menuCtrl.open();
    }    

    doRefresh(ev){
        this.page = 0;
        this.http.post(API_URI + "getallscholarships",{
            page: this.page,
            nums: this.nums,
            availableto: this.applicant_type
        }).subscribe(res => {
            this.scholarships = res.json().scholarships;
            if(this.scholarships.length >= this.nums){
                this.enableMore = true;
            }else{
                this.enableMore = false;
            }
            ev.complete();
        });
    }

    doInfinite(ev){
        this.page = this.page + 1;
        this.http.post(API_URI + "getallscholarships",{
            page: this.page,
            nums: this.nums,
            availableto: this.applicant_type
        }).subscribe(res => {
            var i = 0;
            for(i = 0; i < res.json().scholarships.length; i++){
                this.scholarships.push(res.json().scholarships[i]);
            }
            console.log(i);
            if(i > this.nums){
                this.enableMore = true;
            }else{
                this.enableMore = false;
            }
            ev.complete();
        });
    }

    goToDetailPage(scholarship){
        this.navCtrl.push(ScholarshipSinglePage, {
            scholarship_id: scholarship.id
        });
    }    

    settab(index){
        this.step = index;
    }

    order(event){
        let popover = this.popoverCtrl.create(ScholarshipOrderPage);
        popover.present({
            ev: event
        });
    }

    search(){
        
    }
}

