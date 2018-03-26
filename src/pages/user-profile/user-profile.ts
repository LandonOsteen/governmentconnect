import {Component} from '@angular/core';
import {IonicPage, NavController, App} from 'ionic-angular';
import {AngularFireAuth} from 'angularfire2/auth';
import {UserProvider} from '../../providers/user/user';

@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {


  protected user: User;
  protected readonly = true;

  constructor(public app: App,
              public navCtrl: NavController,
              public firebaseAuth: AngularFireAuth,
              public userProvider: UserProvider) {
  }


  async ionViewDidLoad() {
    const me = this.firebaseAuth.auth.currentUser;
    this.user = await this.userProvider.getUser(me.uid, true);
  }

  async updateUserDetails() {
    this.userProvider.updateUser(this.user);

  }

  async updateUserPhoto() {
    this.userProvider.uploadUserProfilePicture(this.user);
  }

  async editUser() {
    this.readonly = false;
  }


}
