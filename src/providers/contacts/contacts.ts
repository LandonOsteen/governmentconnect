import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ContactsProvider {

  constructor(
    public firebaseAuth: AngularFireAuth,
    public firebaseDatabase: AngularFireDatabase
  ) { }

  getContact(contactId: string): Promise<{ err?: any, contact?: Contact }> {
    const user = this.firebaseAuth.auth.currentUser

    return this.firebaseDatabase
      .object(`connections/${user.uid}/${contactId}`)
      .valueChanges()
      .take(1)
      .toPromise()
  }

  getContacts() {
    const user = this.firebaseAuth.auth.currentUser
    
    if (user) {
      return this.firebaseDatabase.object(`connections/${user.uid}`).valueChanges()
    }
  }

}
