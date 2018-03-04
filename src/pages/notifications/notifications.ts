import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InvitationsProvider } from '../../providers/invitations/invitations';

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {

  invitations = []

  constructor(
    public navCtrl: NavController,
    public invitationsProvider: InvitationsProvider
  ) { }

  acceptInvitation(inviterId: string) {
    this.invitationsProvider.acceptInvitation(inviterId)
  }

  async ionViewDidLoad() {
    const invitations = await this.invitationsProvider.getInvitations()

    if (invitations) {
      this.invitations = Object['values'](invitations)
    }
  }

}
