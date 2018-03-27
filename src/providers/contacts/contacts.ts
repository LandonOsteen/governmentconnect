import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {AngularFireAuth} from 'angularfire2/auth';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/toPromise';
import _ from "lodash";

@Injectable()
export class ContactsProvider {

  constructor(public firebaseAuth: AngularFireAuth,
              public firebaseDatabase: AngularFireDatabase) {
  }

  getContact(contactId: string): Promise<{ err?: any, contact?: Contact }> {
    const user = this.firebaseAuth.auth.currentUser;

    return this.firebaseDatabase
      .object(`connections/${user.uid}/${contactId}`)
      .valueChanges()
      .take(1)
      .toPromise()
  }

  getContacts() {
    const user = this.firebaseAuth.auth.currentUser

    if (user) {
      return this.firebaseDatabase
        .object<{ string: Contact }>(`connections/${user.uid}`)
        .valueChanges()
        .map(contacts => _.values(contacts))
    }
  }

  // To initiate a connection, you simply need to write to the "connections" hash for your user the
  // following:
  // [$uid]: {
  //   uid: ' ... '
  // }
  //
  // A Firebase cloud function will be trigger by your doing so, and the remainder of the connection
  // will be fleshed out. Additionally, a connection object will be created for the receiving user...
  initiateConnection(contactId: string) {
    const user = this.firebaseAuth.auth.currentUser

    if (user) {
      this.firebaseDatabase.object(`connections/${contactId}/${user.uid}/initiated`).set(true)

      this.firebaseDatabase.object(`connections/${user.uid}/${contactId}/established`).set(true)
      this.firebaseDatabase.object(`connections/${user.uid}/${contactId}/initiated`).set(true)
    }
  }

  revokeConnectionRequest(contactId: string) {
    const user = this.firebaseAuth.auth.currentUser

    this.firebaseDatabase.object(`connections/${user.uid}/${contactId}`).remove()
    this.firebaseDatabase.object(`invites/${contactId}/${user.uid}`).remove()
  }
}
