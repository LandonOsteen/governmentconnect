import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {InvitationsProvider} from '../../providers/invitations/invitations';
import {NotificationsProvider} from '../../providers/notifications/notifications';

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {

  public invitations: Invitation[];
  public notifications: Notification[];

  constructor(public navCtrl: NavController,
              public notificationsProvider: NotificationsProvider,
              public invitationsProvider: InvitationsProvider) {
  }

  ionViewDidLoad() {
  }

  async ionViewWillEnter() {
    await this.loadInvitations();
    await this.loadNotifications();
  }

  async loadInvitations() {
    this.invitations = await this.invitationsProvider.getInvitations() as Invitation[];
  }

  async loadNotifications() {
    this.notifications = await this.notificationsProvider.getNotifications() as Notification[];
  }

  async acceptInvitation(inviterId: string) {
    await this.invitationsProvider.acceptInvitation(inviterId);
    await this.loadInvitations();
    await this.loadNotifications();
  }

  async rejectInvitation(inviterId: string) {
    await this.invitationsProvider.revokeInvitation(inviterId);
    await this.loadInvitations();
    await this.loadNotifications();
  }

}
