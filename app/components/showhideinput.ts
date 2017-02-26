import { Component, ContentChild }  from '@angular/core';

@Component({
    selector: 'show-hide-input',
    template: '<ion-item class="app-input-container">' +
              '<ion-icon primary name="key" item-left>'+
              '</ion-icon><ng-content></ng-content>'+
              ' <ion-icon primary name="{{icon}}" item-right (click)="showToggle()"></ion-icon></ion-item>'
})

export class ShowHideInput {
    private show = true;
    private icon = "ios-eye-off-outline";
    @ContentChild('showhideinput') input;
    constructor(){

    }

    showToggle(){
        this.show = !this.show;
        if(this.show){
            this.input.nativeElement.type = "text";
            this.icon = "ios-eye-outline";
        }else{
            this.input.nativeElement.type = "password";
            this.icon = "ios-eye-off-outline";
        }
    }
}