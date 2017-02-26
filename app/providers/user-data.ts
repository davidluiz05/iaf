import { Injectable } from '@angular/core';
import { Events, LocalStorage, Storage} from 'ionic-angular';

@Injectable()
export class UserData {
    storage = new Storage(LocalStorage);
    HAS_LOGGED_IN = 'hasLoggedIn';
     
    DATA = "user-data";    

    constructor(public events: Events){   
        this.storage.set(this.HAS_LOGGED_IN, false);
    }

    logout(){
        this.storage.remove(this.DATA);        
        this.events.publish('user:logout');    
    }
    
    getUserData(){
        return this.storage.get(this.DATA).then((value)=> {
            return value;
        })
    }

    hasLoggedIn() {
        return this.storage.get(this.HAS_LOGGED_IN).then((value) => {            
            return value;
        });
    }

    login(userData){ 
        console.log(userData);       
        if(userData.profile_image == null){
            userData.profile_image = "img/user.png";
        }
        this.storage.set(this.HAS_LOGGED_IN, true);
        this.storage.set(this.DATA, JSON.stringify(userData));        
        this.events.publish('user:login',userData);        
    } 
    
       
}