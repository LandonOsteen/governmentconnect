import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Push } from '@ionic-native/push';
import { Platform } from 'ionic-angular';

@Injectable()
export class PushProvider {

  constructor(
    public firebaseAuth: AngularFireAuth,
    public firebaseDatabase: AngularFireDatabase,
    public platform: Platform,
    public push: Push
  ) { }

  async savePushRegistrationToken(token: string) {
    const user = this.firebaseAuth.auth.currentUser
    
    if (user) {
      await this.firebaseDatabase.object(`notification_tokens/${user.uid}/${token}`).set(true)
    }
  }

  async requestNotificationPermissions() {
    await this.platform.ready();

    const pushObject = this.push.init({
      android: {
        senderID: '615052831647'
      }
    });

    pushObject.on('registration').subscribe(async (registration) => {
      this.savePushRegistrationToken(registration.registrationId)
    });

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }

}
