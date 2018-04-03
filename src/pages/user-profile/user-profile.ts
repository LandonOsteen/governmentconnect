import { Component } from '@angular/core';
import { IonicPage, NavController, App, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserProvider } from '../../providers/user/user';

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
              public navParams: NavParams,
              public firebaseAuth: AngularFireAuth,
              public userProvider: UserProvider) {
  }


  async ionViewDidLoad() {
    const me = this.firebaseAuth.auth.currentUser;
    this.user = await this.userProvider.getUser(me.uid, true);
  }

  async updateUserDetails() {
    try {
      this.userProvider.updateUser(this.user);
      this.readonly = true;
    } catch (err) {
      console.log('update failed', err);
    }
  }

  async updateUserPhoto() {
    try {
      this.user.photoUrl = await this.userProvider.uploadUserProfilePicture(this.user);
      await this.updateUserDetails();
    } catch (err) {
      console.log('upload failed', err);
    }
  }

  editUser() {
    this.readonly = false;
  }
}
