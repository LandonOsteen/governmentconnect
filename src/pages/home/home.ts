import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import CCCredentials from '../../credentials';
import { Platform } from 'ionic-angular/platform/platform';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { CometChatProvider } from '../../providers/comet-chat/comet-chat';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  initializing = true
  initializationError = null

  username = ''
  password = ''

  loggedIn = false

  constructor(
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public cometChat: CometChatProvider
  ) { }

  async ionViewWillEnter() {
    try {
      await this.cometChat.initialize()
    } catch (err) {
      this.initializationError = err
    }

    this.initializing = false
  }

  async launchCometChat() {
    try {
      this.cometChat.launch()
    } catch (err) {
      alert('Sorry, there was an error launching the chat client.')
    }
  }

  async login() {
    const loader = this.loadingCtrl.create();

    loader.present()

    try {
      await this.cometChat.login(this.username, this.password)

      this.loggedIn = true
    } catch (err) {
      alert('Sorry, those credentials didn\'t work')
    }

    loader.dismiss()

  }

}
