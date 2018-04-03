import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ContactsProvider } from '../../providers/contacts/contacts';
import { UserProvider } from '../../providers/user/user';
import { ConnectionProvider } from '../../providers/connection/connection';
import { InvitationsProvider } from '../../providers/invitations/invitations';

@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {

  loaded = false;
  loading = false;
  contact = {};
  user: any = {};
  userId: any = '';
  isConnected = false;
  hasInvited: any;
  public confirmConnectionRemoval = false;
  public requestConnection = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public connectionProvider: ConnectionProvider,
              public contactsProvider: ContactsProvider,
              public invitationProvider: InvitationsProvider,
              public userProvider: UserProvider) {
  }

  async ionViewDidLoad() {
    this.loading = true;
    const userId = this.userId = this.navParams.get('userId');

    this.isConnected = await this.connectionProvider.isUserConnectedTo(userId);
    this.hasInvited = await this.invitationProvider.haveInvitedUser(userId);

    this.user = await this.userProvider.getUser(userId, this.isConnected);

    this.contact = await this.contactsProvider.getContact(userId);

    this.loaded = true;
    this.loading = false;
  }

  async revokeInvitation() {
    await this.invitationProvider.revokeInvitation(this.user);

    this.hasInvited = false;
  }

  async sendInvitation() {
    this.requestConnection = false;
    await this.invitationProvider.sendInvitation(this.user);

    this.hasInvited = true;
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
