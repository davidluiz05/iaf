import { Injectable } from '@angular/core';
import { Events, LocalStorage, Storage} from 'ionic-angular';

@Injectable()
export class UserData {
    storage = new Storage(LocalStorage);
    HAS_LOGGED_IN = 'hasLoggedIn';
    FULLNAME = "fullname";
    ID = "id";
    PROFILE_IMG = "profile_img";         

    constructor(private events: Events){   
        this.storage.set(this.HAS_LOGGED_IN, false);   
    }

    logout(){
        this.storage.remove(this.HAS_LOGGED_IN);
        this.storage.remove(this.FULLNAME);
        this.storage.remove(this.ID);    
        this.events.publish('user:logout');    
    }

    getFullName(){
        return this.storage.get(this.FULLNAME).then((value)=>{            
            return value;
        });
    }

    getUserID(){
        return this.storage.get(this.ID).then((value)=>{
           return value; 
        });
    }

    hasLoggedIn() {
        return this.storage.get(this.HAS_LOGGED_IN).then((value) => { 
            console.log(value);           
            return value;
        });
    }

    login(userData){
        console.log(userData);      
        if(userData.profile_image == null){
            userData.profile_image = "img/user.png";
        }
        this.storage.set(this.HAS_LOGGED_IN, true);
        this.storage.set(this.FULLNAME, userData.full_name);
        this.storage.set(this.ID, userData.user_id);
        this.storage.set(this.PROFILE_IMG,userData.profile_image);
        this.events.publish('user:login',userData);   
        console.log(userData);
    }    
}