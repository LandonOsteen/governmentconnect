import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class InvitationsProvider {

  constructor(
    public firebaseAuth: AngularFireAuth,
    public firebaseDatabase: AngularFireDatabase
  ) { }

  acceptInvitation(invitorId: string) {
    // Transaction with three components:
    // 1. Create my own connection.
    // 2. Set the other connection to ACCEPTED.
    // 3. Set invite to ACCEPTED.
  }

  rejectInvitation(invitorId: string) {
    // Transaction with three components:
    // 1. Set the other connection to REJECTED.
    // 2. Set invite to REJECTED.
  }

  getInvitations() {
    const user = this.firebaseAuth.auth.currentUser

    return this.firebaseDatabase
      .object(`invitations/${user.uid}`)
      .valueChanges()
      .take(1)
      .toPromise()
  }
}
