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

  loaded = false
  contact = {}
  user: any = {}
  isConnected = false
  hasInvited = false

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public connectionProvider: ConnectionProvider,
    public contactsProvider: ContactsProvider,
    public invitationProvider: InvitationsProvider,
    public userProvider: UserProvider
  ) { }

  async ionViewDidLoad() {
    const userId = this.navParams.get('userId')

    const user = await this.userProvider.getUser(userId)

    this.user = user

    const contact = await this.contactsProvider.getContact(userId)

    this.contact = contact

    this.isConnected = await this.connectionProvider.isUserConnectedTo(userId)

    this.hasInvited = await this.invitationProvider.haveInvitedUser(user)

    this.loaded = true
  }

  revokeInvitation() {
    this.invitationProvider.revokeInvitation(this.user)
  }

  sendInvitation() {
    this.invitationProvider.sendInvitation(this.user)
  }

}
