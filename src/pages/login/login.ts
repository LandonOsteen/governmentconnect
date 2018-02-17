import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

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

      const alert = this.alertCtrl.create({
        title: 'Success!',
        message: 'Those credentials are valid!'
      })

      alert.present()
    } catch (err) {
      const alert = this.alertCtrl.create({
        title: 'Hmm...',
        message: 'Those credentials are invalid...'
      })

      alert.present()
    }
  }
}
