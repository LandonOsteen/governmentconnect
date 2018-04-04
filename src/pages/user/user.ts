import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ContactsProvider} from '../../providers/contacts/contacts';
import {UserProvider} from '../../providers/user/user';
import {ConnectionProvider} from '../../providers/connection/connection';
import {InvitationsProvider, InvitationStatus} from '../../providers/invitations/invitations';

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

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public connectionProvider: ConnectionProvider,
              public contactsProvider: ContactsProvider,
              public invitationProvider: InvitationsProvider,
              public userProvider: UserProvider) {
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
}
