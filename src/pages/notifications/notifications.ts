import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InvitationsProvider } from '../../providers/invitations/invitations';

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {

  invites = []

  constructor(
    public navCtrl: NavController,
    public invitationsProvider: InvitationsProvider
  ) { }

  async ionViewDidLoad() {
    const invites = await this.invitationsProvider.getInvitations()

    console.log(invites)

    if (invites) {
      this.invites = Object['values'](invites)
    }
  }

}
