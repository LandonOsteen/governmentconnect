import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ChatsProvider } from '../../providers/chat/chats';

@IonicPage()
@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html',
})
export class ChatsPage {
  public showChatTypeModal = false;
  public channels: Channel[];
  public params = 'ChatUserPage';

  constructor(private navCtrl: NavController,
              private chatsProvider: ChatsProvider,
              private navParams: NavParams) {
  }

  async ionViewDidLoad() {
  }

  async ionViewWillEnter() {
    const results = await this.chatsProvider.getChannels();
    this.channels = (results.length) ? results : [];
  }

  ionViewDidLeave() {
    this.showChatTypeModal = false;
  }

  selectChatType() {
    this.showChatTypeModal = true;
  }
}
