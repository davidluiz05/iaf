import { Injectable } from '@angular/core';
import { NativeStorage } from 'ionic-native';

@Injectable()
export class AppStorage{
    constructor(){}

    setUserData(data){
        return new Promise(resolve => {
             NativeStorage.setItem('user-data', data).then(() => {
                 resolve(true);
            }, err => {
                resolve(false);
            });
        });       
    }

    getUserData(){
        return new Promise(resolve => {
            NativeStorage.getItem('user-data').then(data => {
                resolve(data);
            }, err => {
                resolve(null);
            });
        });        
    }
}