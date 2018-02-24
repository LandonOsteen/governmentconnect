import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class InvitationsProvider {

  constructor(
    public firebaseAuth: AngularFireAuth,
    public firebaseDatabase: AngularFireDatabase
  ) { }

  async acceptInvitation(inviter: User) {
    const me = this.firebaseAuth.auth.currentUser

    if (me) {
      const result: any = await this.firebaseDatabase
        .object(`/invitations/${me.uid}/${inviter.uid}`)
        .update({
          active: false,
          accepted: true
        })

      const connResult: any = await this.firebaseDatabase
        .object(`/connections/${me.uid}/${inviter.uid}`)
        .set({ 
          active: true,
          firstName: inviter.firstName, 
          lastName: inviter.lastName,
          photoUrl: inviter.photoUrl,
          stafferFor: inviter.stafferFor,
          uid: inviter.uid
        })

      return result
    }
  }

  async rejectInvitation(inviter: User) {
    const me = this.firebaseAuth.auth.currentUser

    if (me) {
      const result: any = await this.firebaseDatabase
        .object(`/invitations/${me.uid}/${inviter.uid}`)
        .update({
          active: false,
          accepted: false
        })
    }
  }

  async haveInvitedUser(invitee: User) {
    const me = this.firebaseAuth.auth.currentUser

    if (me) {
      const invitation: any = await this.firebaseDatabase.object(`/invitations/${invitee.uid}/${me.uid}`)
        .valueChanges()
        .take(1)
        .toPromise()

      return invitation && invitation.active
    }
  }

  async haveBeenInvitedByUser(inviter: User) {
    const me = this.firebaseAuth.auth.currentUser

    if (me) {
      const invitation: any = await this.firebaseDatabase.object(`/invitations/${me.uid}/${inviter.uid}`)
        .valueChanges()
        .take(1)
        .toPromise()

      return invitation && invitation.active
    }
  }

  async getInvitations() {
    const user = this.firebaseAuth.auth.currentUser

    const invitations = await this.firebaseDatabase
      .object(`invitations/${user.uid}`)
      .valueChanges()
      .take(1)
      .toPromise()

    return invitations
  }

  async revokeInvitation(invitee: User) {
    const me = this.firebaseAuth.auth.currentUser

    if (me) {
      const result: any = await this.firebaseDatabase
        .object(`/invitations/${invitee.uid}/${me.uid}/active`)
        .update({
          accepted: false,
          active: false
        })

      const connResult: any = await this.firebaseDatabase
        .object(`/connections/${me.uid}/${invitee.uid}/active`)
        .set(false)

      return result
    }
  }

  async sendInvitation(user: User) {
    const me = this.firebaseAuth.auth.currentUser

    if (me) {
      const result: any = await this.firebaseDatabase
        .object(`/invitations/${user.uid}/${me.uid}`)
        .set({ 
          firstName: user.firstName,
          lastName: user.lastName,
          photoUrl: user.photoUrl,
          uid: user.uid,
          active: true,
          accepted: false
        })

      const connResult: any = await this.firebaseDatabase
        .object(`/connections/${me.uid}/${user.uid}`)
        .set({ 
          active: true,
          firstName: user.firstName, 
          lastName: user.lastName,
          photoUrl: user.photoUrl,
          stafferFor: user.stafferFor,
          uid: user.uid
        })

      return result
    }
  }
}
