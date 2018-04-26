import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase} from 'angularfire2/database';
import _ from 'lodash';
import 'rxjs/add/operator/take';
import {UserProvider} from '../user/user';
import 'rxjs/add/operator/take';

@Injectable()
export class ConnectionProvider {

  constructor(public firebaseAuth: AngularFireAuth,
              public firebaseDatabase: AngularFireDatabase,
              public userProvider: UserProvider) {
  }

  async getConnections() {
    const user = this.firebaseAuth.auth.currentUser;
    const userId = user.uid;

    const contacts = await this.firebaseDatabase
      .object(`connections/${userId}`)
      .valueChanges()
      .take(1)
      .toPromise();

    let result = [];
    if (contacts) {
      Object.keys(contacts).map(async (uid, index) => {
        contacts[uid].user = await this.userProvider.getUser(contacts[uid].userId);
        result.push(contacts[uid]);
      });
    }
    return result;


  }

  async getConnectionsIds() {
    const user = this.firebaseAuth.auth.currentUser;
    const userId = user.uid;
    const contacts = await this.firebaseDatabase
      .object(`connections/${userId}`)
      .valueChanges()
      .take(1)
      .toPromise();
    return Object.keys(contacts);
  }

  async isUserConnectedTo(connectionId: string) {
    const user = this.firebaseAuth.auth.currentUser;

    if (user) {
      const selfLink: any = await this.firebaseDatabase.object(`/connections/${user.uid}/${connectionId}`)
        .valueChanges()
        .take(1)
        .toPromise();

      const connectionLink: any = await this.firebaseDatabase.object(`/connections/${connectionId}/${user.uid}`)
        .valueChanges()
        .take(1)
        .toPromise();

      if ((selfLink && selfLink.active) && (connectionLink && connectionLink.active)) {
        return true;
      } else {
        return false;
      }
    }
  }

  async removeConnection(connectionId: string) {
    const user = this.firebaseAuth.auth.currentUser;
    await this.firebaseDatabase.object(`/connections/${user.uid}/${connectionId}`).remove();
    await this.firebaseDatabase.object(`/connections/${connectionId}/${user.uid}`).remove();

  }

  async createConnection(inviteeId: string, inviterId: string) {
    // Direct connection
    await this.firebaseDatabase
      .object(`/connections/${inviteeId}/${inviterId}`)
      .set({
        active: true,
        userId: inviterId,
      });

    // Inverse connection
    await this.firebaseDatabase
      .object(`/connections/${inviterId}/${inviteeId}`)
      .set({
        active: true,
        userId: inviteeId,
      });
  }

}
