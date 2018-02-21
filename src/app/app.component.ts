import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from 'angularfire2/auth';
import { APP_PAGES } from '../enums';
import 'rxjs/add/operator/first';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage = APP_PAGES.WELCOME_PAGE
  loaded = false

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    public firebaseAuth: AngularFireAuth
  ) {
      this.firebaseAuth.authState.first().subscribe((user) => {
        if (user) {
          this.rootPage = APP_PAGES.TABS_PAGE
        }

        this.loaded = true
        
        this.platform.ready().then(() => {
            
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
      })
  }
}

