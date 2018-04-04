import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase} from 'angularfire2/database';
import {UserProvider} from '../user/user';
import 'rxjs/add/operator/take';
import {ConnectionProvider} from '../connection/connection';
import {UUID} from 'angular2-uuid';


@Injectable()
export class NotificationsProvider {

  constructor(public firebaseAuth: AngularFireAuth,
              public userProvider: UserProvider,
              public firebaseDatabase: AngularFireDatabase) {
  }

  async addNotification(toUserId: string, actorId: string, message: string) {

    let uuid = UUID.UUID();

    await this.firebaseDatabase
      .object(`notifications/${toUserId}/${uuid}`)
      .update({
        actorId: actorId,
        actorType: 'user',
        message: message,
        createdAt: new Date(),
      });

  }


  async getNotifications() {
    const authUser = this.firebaseAuth.auth.currentUser;

    let userId = authUser.uid;
    let notifications = await this.firebaseDatabase
      .object(`notifications/${userId}`)
      .valueChanges()
      .take(1)
      .toPromise();

    let result = [];
    if (notifications) {

      Object.keys(notifications).map(async (uid, index) => {
        if (notifications[uid].actorType === 'user') {
          notifications[uid].actor = await this.userProvider.getUser(notifications[uid].actorId);
        }
        result.push(notifications[uid]);
      });
    }

    return result
      .sort((a, b) => {
        if (a.createdAt < b.createdAt) return -1;
        if (a.createdAt > b.createdAt) return 1;
        return 0;
      });
  }

}
