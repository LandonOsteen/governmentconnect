import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { CometChatProvider } from '../../providers/comet-chat/comet-chat';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  initializing = true
  initializationError = null
  launching = false

  username = ''
  password = ''

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

  async login() {
    const loader = this.loadingCtrl.create();

    loader.present()

    try {
      await this.cometChat.login(this.username, this.password)
    } catch (err) {
      alert('Sorry, those credentials didn\'t work')
    }

    loader.dismiss()

    this.launching = true

    try {
      this.cometChat.launch()
    } catch (err) {
      alert('Sorry, there was an error launching the chat client.')
    }
  }

  recover() {
    window.location.href = 'https://governmentconnect.net/password-reset'
  }

}
