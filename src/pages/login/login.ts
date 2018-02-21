import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { APP_PAGES } from "../../enums";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  email: string = ''
  password: string = ''

  constructor(
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public firebaseAuth: AngularFireAuth
  ) { }

  async login() {
    try {
      await this.firebaseAuth.auth.signInAndRetrieveDataWithEmailAndPassword(this.email, this.password)

      this.navCtrl.push(APP_PAGES.TABS_PAGE) 
    } catch (err) {
      const alert = this.alertCtrl.create({
        title: 'Hmm...',
        message: 'Those credentials are invalid...'
      })

      alert.present()
    }
  }
}
