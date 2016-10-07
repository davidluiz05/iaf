import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class Progress {
    progress: any;
    constructor(private loadingCtrl: LoadingController){}

    show(message: string){
        this.progress = this.loadingCtrl.create({
            content: message
        });
        this.progress.present();
    }

    dismiss(){
        this.progress.dismiss();
    }
}