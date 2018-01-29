import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { CometChatProvider } from '../../providers/comet-chat/comet-chat';
import { Storage } from '@ionic/storage/dist/storage';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  initializing = true
  initialized = false
  initializationError = null

  launching = false
  launched = false
  launchError = null

  username = ''
  password = ''

  constructor(
    public cometChat: CometChatProvider,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public storage: Storage
  ) { }

  async ionViewWillEnter() {
    try {
      await this.cometChat.initialize()
    } catch (err) {
      this.initializationError = err
    }

    const isLoggedIn = await this.storage.get('isLoggedIn')

    if (isLoggedIn) {
      this.launch()
      this.initializing = false
      this.initialized = true
    } else {
      this.initializing = false
    }
  }

  async launch() {
    this.launching = true

    try {
      await this.cometChat.launch()

      this.launched = true
    } catch (err) {
      this.launchError = err;

      alert('Sorry, there was an error launching the chat client.')
    }

    this.launching = false
  }

  async login() {
    const loader = this.loadingCtrl.create();

    loader.present()

    try {
      await this.cometChat.login(this.username, this.password)
    } catch (err) {
      alert('Sorry, those credentials didn\'t work')
      loader.dismiss()
      return
    }

    await this.storage.set('isLoggedIn', true)

    this.launch()

    loader.dismiss()
  }

  recover() {
    window.location.href = 'https://governmentconnect.net/password-reset'
  }
}
