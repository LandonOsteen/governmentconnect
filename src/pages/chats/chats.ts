import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ChatsProvider} from '../../providers/chat/chats';

@IonicPage()
@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html',
})
export class ChatsPage {

  channels: Channel[];

  constructor(private navCtrl: NavController,
              private chatsProvider: ChatsProvider,
              private navParams: NavParams) {
  }

  async ionViewDidLoad() {

  }

  async ionViewWillEnter() {
    this.channels = await this.chatsProvider.getChannels();
  }

}
