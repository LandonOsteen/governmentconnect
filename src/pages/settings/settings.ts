import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { APP_PAGES } from '../../enums';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(
    public navCtrl: NavController, 
    public firebaseAuth: AngularFireAuth
  ) { }

  async logout() {
    await this.firebaseAuth.auth.signOut()

    this.navCtrl.popTo(APP_PAGES.WELCOME_PAGE)
  }

}
