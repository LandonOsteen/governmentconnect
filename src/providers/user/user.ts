import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class UserProvider {

  constructor(
    public firebaseAuth: AngularFireAuth,
    public firebaseDatabase: AngularFireDatabase
  ) { }

  getUser(userId: string) {
    return this.firebaseDatabase
      .object(`users/${userId}`)
      .valueChanges()
      .take(1)
      .toPromise()
  }

}
