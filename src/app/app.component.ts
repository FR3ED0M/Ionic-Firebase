import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//new imports
import { OAuthService } from 'angular-oauth2-oidc';
import { LoginPage } from '../pages/login/login';


import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, oauthService: OAuthService) {
    
    //new stuff
    if (oauthService.hasValidIdToken()) {
        this.rootPage = HomePage;
    } else {
        this.rootPage = LoginPage;    
    }
    
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

