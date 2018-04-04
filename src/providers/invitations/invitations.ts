import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase} from 'angularfire2/database';
import {UserProvider} from '../user/user';
import 'rxjs/add/operator/take';
import {ConnectionProvider} from '../connection/connection';
import {NotificationsProvider} from '../notifications/notifications';

export class InvitationStatus {
  static NONE = "NONE";
  static INVITEE = "INVITEE";
  static INVITED = "INVITED";
}

@Injectable()
export class InvitationsProvider {

  constructor(public firebaseAuth: AngularFireAuth,
              public firebaseDatabase: AngularFireDatabase,
              public notificationProvider: NotificationsProvider,
              public userProvider: UserProvider,
              public connectionProvider: ConnectionProvider) {
  }

  async acceptInvitation(inviterId: string) {

    const authUser = this.firebaseAuth.auth.currentUser;
    if (!authUser) {
      return;
    }

    let inviteeId = authUser.uid;

    // Process invitation
    await this.firebaseDatabase
      .object(`/invitations/${inviteeId}/${inviterId}`)
      .remove();

    await this.connectionProvider.createConnection(inviteeId, inviterId);

    await this.notificationProvider.addNotification(inviteeId, inviteeId, " accepted connection request");
    await this.notificationProvider.addNotification(inviterId, inviteeId, " accepted connection request");

  }


  /**
   *
   * @param {string} userId
   * @returns {Promise<InvitationStatus>}
   */
  async getInvitationStatus(userId: string) {
    const authUser = this.firebaseAuth.auth.currentUser;
    if (!authUser) {
      return false;
    }

    let inviterId = authUser.uid;

    let _invited = await this.firebaseDatabase
      .object(`/invitations/${userId}/${inviterId}`)
      .valueChanges()
      .take(1)
      .toPromise() as Invitation;
    if (_invited) {
      return InvitationStatus.INVITED
    }

    let _invitee = await this.firebaseDatabase
      .object(`/invitations/${inviterId}/${userId}`)
      .valueChanges()
      .take(1)
      .toPromise() as Invitation;
    if (_invitee) {
      return InvitationStatus.INVITEE;
    }

    return InvitationStatus.NONE;
  }


  /**
   * Get all invitations
   * @returns {Promise<any>}
   */
  async getInvitations() {
    const authUser = this.firebaseAuth.auth.currentUser;

    let inviteeId = authUser.uid;
    let invitations = await this.firebaseDatabase
      .object(`invitations/${inviteeId}`)
      .valueChanges()
      .take(1)
      .toPromise();

    let result = [];
    if (invitations) {

      Object.keys(invitations).map(async (uid, index) => {
        invitations[uid].inviteeUser = await this.userProvider.getUser(invitations[uid].inviteeId);
        invitations[uid].inviterUser = await this.userProvider.getUser(invitations[uid].inviterId);
        result.push(invitations[uid]);
      });
    }

    return result;

  }

  /**
   * Revoke invitation
   * @returns {Promise<void>}
   * @param inviteeId
   */
  async revokeInvitation(inviteeId: string) {

    const authUser = this.firebaseAuth.auth.currentUser;
    if (!authUser) {
      return;
    }

    let inviterId = authUser.uid;
    await this.firebaseDatabase
      .object(`/invitations/${inviteeId}/${inviterId}`)
      .remove();


    await this.firebaseDatabase
      .object(`/invitations/${inviterId}/${inviteeId}`)
      .remove();

    await this.notificationProvider.addNotification(inviteeId, inviterId, " revoked connection request");
    await this.notificationProvider.addNotification(inviterId, inviterId, " revoked connection request");
  }


  /**
   * Send user invitation
   * @param inviteeId
   * @param message
   * @returns {Promise<void>}
   */
  async sendInvitation(inviteeId: string, message: string) {
    const authUser = this.firebaseAuth.auth.currentUser;
    if (!authUser) {
      return;
    }

    let inviterId = authUser.uid;

    await this.firebaseDatabase
      .object(`/invitations/${inviteeId}/${inviterId}`)
      .update({
        inviteeId: inviteeId,
        inviterId: inviterId,
        processed: false,
        message: message,
        createdAt: new Date(),
      });

    await this.notificationProvider.addNotification(inviteeId, inviterId, " sent connection request");
    await this.notificationProvider.addNotification(inviterId, inviterId, " sent connection request");

  }
}
