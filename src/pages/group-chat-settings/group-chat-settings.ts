import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserProvider } from '../../providers/user/user';
import { APP_PAGES } from "../../enums";
import { ChatsProvider } from '../../providers/chat/chats';

@IonicPage()
@Component({
  selector: 'page-group-chat-settings',
  templateUrl: 'group-chat-settings.html',
})
export class GroupChatSettingsPage {

  public user: User;

  public group = {
    name: '',
    photoUrl: ''
  };

  public selectedUsers = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private loadingCtrl: LoadingController,
              public events: Events,
              public firebaseAuth: AngularFireAuth,
              public userProvider: UserProvider,
              public chatsProvider: ChatsProvider) {

    this.events.subscribe('multiselect:user', (res) => {
      this.selectedUsers = res;
    });
  }

  async ionViewDidLoad() {
    const me = this.firebaseAuth.auth.currentUser;
    this.user = await this.userProvider.getUser(me.uid, true, true);
    this.group.name = this.user.firstName + ' Chat Group';
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

  async startChat() {
    const actorId = this.firebaseAuth.auth.currentUser.uid;
    let userIds = this.getSelectedUserIds();
    const groupName = (this.group.name) ? this.group.name : this.user.firstName + ' Chat Group';

    if (userIds) {
      userIds.push(actorId);
      const channel = await this.chatsProvider.startOrResumeChat(userIds, groupName);
      this.navCtrl.push(APP_PAGES.CHAT_USER_PAGE, {channel: channel});
    }
  }

  getSelectedUserIds() {
    return (this.selectedUsers && this.selectedUsers.length) ?
      this.selectedUsers.map((user) => {
        return user.uid;
      }) : null;
  }

}
