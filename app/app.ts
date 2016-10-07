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
/** */


@Component({
  templateUrl: 'build/app.html',
  providers: [UserData]
})
class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{title: string, component: any}>;

  profilePage: any;    

  data: {
    full_name?: string,
    id?: number,
    profile_image?: string
  }; 

  constructor(public platform: Platform, public userData: UserData, private events: Events, public menuCtrl: MenuController) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'MESSAGES', component: MessageListPage },
      { title: 'APPLICATIONS', component: LoginPage },
      { title: 'COLLEGES', component: LoginPage },
      { title: 'SCHOLARSHIPS', component: LoginPage },
      { title: 'MAGAZINES', component: MagazinePage },
      { title: 'WEEK IN REVIEW', component: PostPage },
      { title: 'AR', component: LoginPage },
      { title: 'RESOURCES', component: ResourcePage },
      { title: 'ABOUT US', component: LoginPage },
      { title: 'ACCOUNT', component: LoginPage }     
    ];

    this.profilePage = ProfilePage;    

    this.data = {
      full_name: "John",
      id: -1,
      profile_image: "img/user.png"
    };
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();  
      /*
      var notificationOpenedCallback = function(jsonData) {
        console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));  
        alert(JSON.stringify(jsonData));      
      };

      window["plugins"].OneSignal.init("b6a309bd-4266-422e-998d-4735c2e70ce7",
                                    {googleProjectNumber: "489648472734"},
                                    notificationOpenedCallback);
      
      
      window["plugins"].OneSignal.enableSound(true);
      window["plugins"].OneSignal.enableVibrate(true);
      window["plugins"].OneSignal.enableNotificationsWhenActive(true);    
      window["plugins"].OneSignal.setSubscription(false);    \
      */            
    });

    this.userData.hasLoggedIn().then((isLogged) => {     
      if(isLogged == 'false'){          
        this.rootPage = LoginPage;
        this.menuCtrl.enable(false, 'authenticated');          
      }else{          
        this.rootPage = HomePage;
      }
    });

    this.events.subscribe("user:login", (data) => {        
      this.data = data[0];
      this.menuCtrl.enable(true, "authenticated");
    });

    this.events.subscribe("user:logout",()=>{  
      this.data = {
        full_name: "John",
        id: -1,
        profile_image: "img/user.png"
      };    
      this.menuCtrl.enable(false,"authenticated");
    });

    this.events.subscribe('user:changephoto', (data)=>{
      this.data.profile_image = data[0];
    });    
  }
  //////////////////////////////////////////////////////////////

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
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
