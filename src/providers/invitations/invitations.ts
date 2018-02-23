import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class InvitationsProvider {

  constructor(
    public firebaseAuth: AngularFireAuth,
    public firebaseDatabase: AngularFireDatabase
  ) { }

  getInvitations() {
    const user = this.firebaseAuth.auth.currentUser

    console.log(user)
    return this.firebaseDatabase
      .object(`invitations/${user.uid}`)
      .valueChanges()
      .take(1)
      .toPromise()
  }
}
