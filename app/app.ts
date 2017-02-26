import { Component, ViewChild } from '@angular/core';
import { ionicBootstrap, Platform, Nav, Events, MenuController } from 'ionic-angular';
import { StatusBar, OneSignal } from 'ionic-native';
import { LoginPage } from './pages/login/login';
import { ProfilePage } from './pages/profile/profile';
import { HomePage } from './pages/home/home';
import { MessageListPage } from './pages/message/list/list';
import { PostPage } from './pages/post/post';
import { ResourcePage } from './pages/resource/resource';
import { MagazinePage } from './pages/magazine/magazine';
import { UserData } from './providers/user-data';
import { Http , Headers, RequestOptions} from '@angular/http';
import { AccountPage } from './pages/account/account';
import { ScholarshipListPage } from './pages/scholarship/list/list';
import { AboutPage } from './pages/about/about';
import { ApplicationListPage } from './pages/application/list/list';
import { SplashPage } from './pages/splash/splash';

import { AppStorage } from './providers/appstorage';
@Component({
  templateUrl: 'build/app.html',
  providers: [UserData, AppStorage]
})
class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage =  SplashPage;

  pages: Array<{title: string, component: any}>;

  profilePage: any;    

  data: {
    full_name?: string,
    id?: number,
    profile_image?: string,
    type ?: number
  }; 

  constructor(public platform: Platform, public userData: UserData, public events: Events, public menuCtrl: MenuController, public appStorage: AppStorage) {
    this.initializeApp();
        
    this.profilePage = ProfilePage;    

    this.data = {
      full_name: "John",
      id: -1,
      profile_image: "img/user.png",
      type: -1
    };

    
  }

  onresume(){
    
  }

  onpause(){
    console.log("pause event");
    this.userData.getUserData().then(data => {
      console.log("Pause event data = " + JSON.stringify(data));
    })
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      /*
      window["plugins"].OneSignal.init("b6a309bd-4266-422e-998d-4735c2e70ce7",
                                    {googleProjectNumber: "489648472734"},
                                    (jsonData)=>{                                                                                                            
                                      this.events.publish('chat:receive', JSON.stringify(jsonData));                             
                                    });
      
      
      window["plugins"].OneSignal.enableSound(false);
      window["plugins"].OneSignal.enableVibrate(false);    
      window["plugins"].OneSignal.enableNotificationsWhenActive(false);    
      this.menuCtrl.enable(false); 
      */
      document.addEventListener('resume', this.onresume, false);   
      document.addEventListener('pause', this.onpause); 
    });

    this.events.subscribe("user:login", (data) => {   
      console.log("login event");     
      this.data = data[0];
      this.menuCtrl.enable(true);
      
      if(this.data.type == 0){ //applicant
        this.pages = [
          { title: 'DASHBOARD', component: HomePage},
          { title: 'MESSAGES', component: MessageListPage },
          { title: 'APPLICATIONS', component: ApplicationListPage },          
          { title: 'SCHOLARSHIPS', component: ScholarshipListPage },
          { title: 'MAGAZINES', component: MagazinePage },
          { title: 'WEEK IN REVIEW', component: PostPage },          
          { title: 'RESOURCES', component: ResourcePage },
          { title: 'ABOUT US', component: AboutPage },
          { title: 'VIDEO', component: AboutPage},
          { title: 'LOGOUT', component: LoginPage}                      
        ];
      }else if(this.data.type == 1){ //college 
        this.pages = [
          { title: 'DASHBOARD', component: HomePage},
          { title: 'MESSAGES', component: MessageListPage },
          { title: 'APPLICATIONS', component: ApplicationListPage },          
          { title: 'SCHOLARSHIPS', component: ScholarshipListPage },
          { title: 'MAGAZINES', component: MagazinePage },
          { title: 'WEEK IN REVIEW', component: PostPage },          
          { title: 'RESOURCES', component: ResourcePage },
          { title: 'ABOUT US', component: AboutPage } ,
          { title: 'VIDEO', component: AboutPage},
          { title: 'LOGOUT', component: LoginPage}          
        ];
      }else if(this.data.type == 2){ //high school
         this.pages = [
          { title: 'DASHBOARD', component: HomePage},
          { title: 'MESSAGES', component: MessageListPage },
          { title: 'APPLICATIONS', component: ApplicationListPage },          
          { title: 'SCHOLARSHIPS', component: ScholarshipListPage },
          { title: 'MAGAZINES', component: MagazinePage },
          { title: 'WEEK IN REVIEW', component: PostPage },          
          { title: 'RESOURCES', component: ResourcePage },
          { title: 'ABOUT US', component: AboutPage } ,
          { title: 'VIDEO', component: AboutPage},
          { title: 'LOGOUT', component: LoginPage}               
        ];
      }else if(this.data.type == 3){ //advertiser
        this.pages = [
          { title: 'DASHBOARD', component: HomePage},
          { title: 'MESSAGES', component: MessageListPage },          
          { title: 'SCHOLARSHIPS', component: ScholarshipListPage },
          { title: 'MAGAZINES', component: MagazinePage },
          { title: 'WEEK IN REVIEW', component: PostPage },        
          { title: 'RESOURCES', component: ResourcePage },
          { title: 'ABOUT US', component: AboutPage },
          { title: 'VIDEO', component: AboutPage},
          { title: 'LOGOUT', component: LoginPage}                
        ];
      }else if(this.data.type == 4){ //donor
         this.pages = [
          { title: 'DASHBOARD', component: HomePage},
          { title: 'MESSAGES', component: MessageListPage },          
          { title: 'SCHOLARSHIPS', component: ScholarshipListPage },
          { title: 'MAGAZINES', component: MagazinePage },
          { title: 'WEEK IN REVIEW', component: PostPage },      
          { title: 'RESOURCES', component: ResourcePage },
          { title: 'ABOUT US', component: AboutPage },
          { title: 'VIDEO', component: AboutPage},
          { title: 'LOGOUT', component: LoginPage}                
        ];
      }else if(this.data.type == 5){ //admin
        this.pages = [
          { title: 'DASHBOARD', component: HomePage},
          { title: 'MESSAGES', component: MessageListPage },
          { title: 'APPLICATIONS', component: ApplicationListPage },          
          { title: 'SCHOLARSHIPS', component: ScholarshipListPage },
          { title: 'MAGAZINES', component: MagazinePage },
          { title: 'WEEK IN REVIEW', component: PostPage },        
          { title: 'RESOURCES', component: ResourcePage },
          { title: 'ABOUT US', component: AboutPage },
          { title: 'ACCOUNTS', component: AccountPage },
          { title: 'VIDEO', component: AboutPage},
          { title: 'LOGOUT', component: LoginPage}       
        ];
      }
    });

    this.events.subscribe("user:logout",()=>{  
      console.log("logout event");
      this.data = {
        full_name: "John",
        id: -1,
        profile_image: "img/user.png",
        type : -1
      };    
      this.menuCtrl.enable(false);
    });

    this.events.subscribe('user:changephoto', (data)=>{
      this.data.profile_image = data[0];
    });

    this.events.subscribe('user:changename', (data)=> {
      this.data.full_name = data[0];
    });
  }
  //////////////////////////////////////////////////////////////

  openPage(page) {
    if(page.title == 'LOGOUT'){
      this.logout();
    }else{
      this.nav.setRoot(page.component);
    }    
  }  

  goToProfilePage(){
    this.nav.setRoot(ProfilePage);
  }

  logout(){
    this.userData.logout();
    this.nav.setRoot(LoginPage);
  }
}

ionicBootstrap(MyApp);
