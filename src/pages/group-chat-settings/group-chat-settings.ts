import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-group-chat-settings',
  templateUrl: 'group-chat-settings.html',
})
export class GroupChatSettingsPage {

  public group = {
    name: '',
    photoUrl: ''
  };

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private loadingCtrl: LoadingController,
              public events: Events) {

    console.log('enter view');

    this.events.subscribe('multiselect:user', (users) => {
      console.log(users);
    });
  }

  ionViewDidLoad() {
  }

  async uploadPhoto() {
    const loader = this.loadingCtrl.create({
      content: 'Please wait'
    });

    loader.present();

    try {
      // this.group.photoUrl = await this.userProvider.uploadUserProfilePicture(this.user);
      // await this.updateUserDetails();

      loader.dismiss();
    } catch (err) {
      console.log('upload failed', err);
      loader.dismiss();
    }
  }

}
