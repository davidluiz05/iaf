import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MenuController, Events } from 'ionic-angular';
import { API_URI } from '../../providers/config';
import { UserData } from '../../providers/user-data';
import { Http } from '@angular/http';
import { SinglePostPage } from './single/single';
import { PostCreatePage } from './create/create';

@Component({
    templateUrl: 'build/pages/post/post.html'
})

export class PostPage {
    private posts : Array<any>;
    private page : number;
    private nums : number;
    private enableMore: boolean;
    zone: any;
    canCreate = false;
    constructor(public navCtrl: NavController, public menuCtrl: MenuController, public http: Http, public events: Events, public userData: UserData){

        //initialize
        this.posts = [];
        this.page = 0;
        this.nums = 8;
        this.enableMore = false;
        this.zone = new NgZone({enableLongStackTrace: false});

        this.userData.getUserData().then(data=>{
            let d = JSON.parse(data);
            if(d.type == 5){
                this.canCreate = true;
            }
        }); 

        this.http.post(API_URI + "getnews", {
            page : this.page,
            nums: this.nums
        }).subscribe(res => {
            this.posts = res.json().news;
            if(this.posts.length >= this.nums){
                this.enableMore = true;
            }
        });

        this.events.subscribe('createnews', (data)=> {
            this.page = 0;        
            this.http.post(API_URI + "getnews", {
                page: this.page,
                nums: this.nums
            }).subscribe(res => {
                this.zone.run(()=>{
                    this.posts = res.json().news;
                    if(this.posts.length >= this.nums){
                        this.enableMore = true;
                    }else{
                        this.enableMore = false;
                    }
                });               
                                
            });  
        });
    }

    doRefresh(ev){
        this.page = 0;        
        this.http.post(API_URI + "getnews", {
            page: this.page,
            nums: this.nums
        }).subscribe(res => {
            this.posts = res.json().news;
            if(this.posts.length >= this.nums){
                this.enableMore = true;
            }else{
                this.enableMore = false;
            }
            ev.complete();
        });       
    }

    doInfinite(ev){        
        this.page = this.page + 1;
        this.http.post(API_URI + "getnews", {
            page: this.page,
            nums: this.nums
        }).subscribe(res => {
            var i =0;
            for(i = 0;i < res.json().news.length; i++){
                this.posts.push(res.json().news[i]);
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

    openMenu(){
        this.menuCtrl.open();
    }

    goToSinglePage(post){
        this.navCtrl.push(SinglePostPage, {
            post: post
        });
    }

    create(){
        this.navCtrl.push(PostCreatePage);
    }
}