import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from 'angularfire2/auth';
import { APP_PAGES } from '../enums';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import 'rxjs/add/operator/first';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage = APP_PAGES.WELCOME_PAGE
  loaded = false

  async initPush() {
    await this.platform.ready();

    const pushObject = this.push.init({
      android: {
        senderID: '615052831647'
      }
    });

    pushObject.on('registration').subscribe(async (registration: any) => {
      // Registered!
    });

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }

  constructor(
    public platform: Platform, 
    public push: Push,
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    public firebaseAuth: AngularFireAuth
  ) {
      this.firebaseAuth.authState.first().subscribe((user) => {
        if (user) {
          this.rootPage = APP_PAGES.TABS_PAGE
        }

        this.loaded = true

        this.initPush()

        this.platform.ready().then(() => {
            
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
      })
  }
}

