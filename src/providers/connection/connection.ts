import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class ConnectionProvider {

  constructor(
    public firebaseAuth: AngularFireAuth,
    public firebaseDatabase: AngularFireDatabase
  ) { }

  async isUserConnectedTo(connectionId: string) {
    const user = this.firebaseAuth.auth.currentUser

    if (user) {
      const selfLink: any = await this.firebaseDatabase.object(`/connections/${user.uid}/${connectionId}`)
        .valueChanges()
        .take(1)
        .toPromise()

      const connectionLink: any = await this.firebaseDatabase.object(`/connections/${connectionId}/${user.uid}`)
        .valueChanges()
        .take(1)
        .toPromise()

      if ((selfLink && selfLink.active) && (connectionLink && connectionLink.active)) {
        return true
      } else {
        return false
      }
    }
  }

async removeConnection(connectionId: string) {
  const user = this.firebaseAuth.auth.currentUser

  if (user) {
    await this.firebaseDatabase.object(`/connections/${user.uid}/${connectionId}/active`).set(false)
  }
}

}
