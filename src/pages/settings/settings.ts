import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { APP_PAGES } from '../../enums';
import { AngularFireDatabase } from 'angularfire2/database';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(public app: App,
              public navCtrl: NavController,
              public firebaseAuth: AngularFireAuth,
              public firebaseDatabase: AngularFireDatabase) {
  }

  async logout() {
    await this.firebaseAuth.auth.signOut();

    await this.app.getRootNav().setRoot(APP_PAGES.WELCOME_PAGE);
  }
}
