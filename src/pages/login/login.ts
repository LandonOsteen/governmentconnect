import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  email: string = ''
  password: string = ''

  constructor(
    public navCtrl: NavController,
    public firebaseAuth: AngularFireAuth
  ) { }

  async login() {
    try {
      const user = await this.firebaseAuth.auth.signInAndRetrieveDataWithEmailAndPassword(this.email, this.password)

      console.log(user)
    } catch (err) {
      console.log(err)
    }
  }
}
