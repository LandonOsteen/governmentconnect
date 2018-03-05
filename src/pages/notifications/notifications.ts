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

  async loadInvitations() {
    const invitations = await this.invitationsProvider.getInvitations()

    if (invitations) {
      this.invitations = Object['values'](invitations).filter(i => i.active)
    }
  }

  async acceptInvitation(inviterId: string) {
    await this.invitationsProvider.acceptInvitation(inviterId)

    this.loadInvitations()
  }

  ionViewDidLoad() {
    this.loadInvitations()
  }

}
