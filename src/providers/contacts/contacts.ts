import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class ContactsProvider {

  constructor(
    public firebaseAuth: AngularFireAuth,
    public firebaseDatabase: AngularFireDatabase
  ) { }

  getContacts() {
    const user = this.firebaseAuth.auth.currentUser
    
    if (user) {
      return this.firebaseDatabase.object(`connections/${user.uid}`).valueChanges()
    }
  }

}
