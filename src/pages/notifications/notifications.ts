import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {InvitationsProvider} from '../../providers/invitations/invitations';

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {

  public invitations: Invitation[];

  constructor(public navCtrl: NavController,
              public invitationsProvider: InvitationsProvider) {
  }

  ionViewDidLoad() {
  }

  async ionViewWillEnter() {
    await this.loadInvitations();
  }

  async loadInvitations() {
    this.invitations = await this.invitationsProvider.getInvitations() as Invitation[];
  }

  async acceptInvitation(inviterId: string) {
    await this.invitationsProvider.acceptInvitation(inviterId);
    this.loadInvitations();
  }

  async rejectInvitation(inviterId: string) {
    await this.invitationsProvider.revokeInvitation(inviterId);
    this.loadInvitations();
  }

}
