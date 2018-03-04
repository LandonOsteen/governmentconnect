import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class PushProvider {

  constructor(
    public firebaseAuth: AngularFireAuth,
    public firebaseDatabase: AngularFireDatabase
  ) { }

  async savePushRegistrationToken(token: string) {
    const user = this.firebaseAuth.auth.currentUser
    
    if (user) {
      await this.firebaseDatabase.object(`notification_tokens/${user.uid}/${token}`).set(true)
    }
  }

}
