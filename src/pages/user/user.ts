import { Component } from '@angular/core';
import { App, ViewController, IonicPage, NavController, NavParams, Nav } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { ConnectionProvider } from '../../providers/connection/connection';
import { InvitationsProvider, InvitationStatus } from '../../providers/invitations/invitations';
import { ChatsProvider } from '../../providers/chat/chats';
import { NotificationsProvider } from '../../providers/notifications/notifications';
import { AngularFireAuth } from 'angularfire2/auth';
import {APP_PAGES} from '../../enums';

@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {

  user: User = null;
  userId: string = '';
  isConnected = false;
  invitationStatus: InvitationStatus = InvitationStatus.NONE;

  confirmConnectionRemoval = false;
  requestConnection = false;
  invitationMessage: string = "";

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private connectionProvider: ConnectionProvider,
              private invitationProvider: InvitationsProvider,
              private chatsProvider: ChatsProvider,
              private notificationsProvider: NotificationsProvider,
              private firebaseAuth: AngularFireAuth,
              private userProvider: UserProvider,
              public appCtrl: App,
              public viewCtrl: ViewController,
              public nav: Nav) {
  }

  async ionViewDidLoad() {

    this.userId = this.navParams.get('userId');
    this.user = await this.userProvider.getUser(this.userId, false, true);

    this.isConnected = await this.connectionProvider.isUserConnectedTo(this.userId);
    this.invitationStatus = await this.invitationProvider.getInvitationStatus(this.userId) as InvitationStatus;

  }

  async revokeInvitation() {
    await this.invitationProvider.revokeInvitation(this.user.uid);
    this.invitationStatus = InvitationStatus.NONE;
  }

  async sendInvitation() {
    this.requestConnection = false;
    await this.invitationProvider.sendInvitation(this.user.uid, this.invitationMessage);
    this.invitationMessage = '';
    this.invitationStatus = InvitationStatus.INVITED;
  }

  async acceptInvitation() {
    await this.invitationProvider.acceptInvitation(this.userId);
    this.isConnected = true;
  }

  async removeConnection() {
    try {
      await this.connectionProvider.removeConnection(this.userId);
    } catch (err) {
      console.error(err);
    }

    this.confirmConnectionRemoval = false;
    this.isConnected = false;
  }

  openRequest() {
    this.requestConnection = true;
  }

  async startChat() {
    const actorId = this.firebaseAuth.auth.currentUser.uid;
    const inConversation = await this.chatsProvider.isInConversationWithUser(this.userId);

    if (!inConversation) {
      await this.notificationsProvider.addNotification(this.userId, actorId, " invited to chat");
      let channelId = await  this.chatsProvider.createChannel();
      await  this.chatsProvider.joinChannel(channelId, this.userId);
    }

    const channel = await  this.chatsProvider.findConversationWithUser(this.userId);
    this.navCtrl.push(APP_PAGES.CHAT_USER_PAGE, {channel: channel});
    
  }
}
