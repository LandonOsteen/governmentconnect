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
  hasInvited: any

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

    this.isConnected = await this.connectionProvider.isUserConnectedTo(userId)
    this.hasInvited = await this.invitationProvider.haveInvitedUser(userId)

    const user = await this.userProvider.getUser(userId, this.isConnected)

    this.user = user

    const contact = await this.contactsProvider.getContact(userId)

    this.contact = contact

    this.loaded = true
  }

  async revokeInvitation() {
    await this.invitationProvider.revokeInvitation(this.user)

    this.hasInvited = false
  }

  async sendInvitation() {
    console.log(this.user)
    await this.invitationProvider.sendInvitation(this.user)

    this.hasInvited = true
  }

}
