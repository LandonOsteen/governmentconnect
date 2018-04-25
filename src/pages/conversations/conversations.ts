import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ChatsProvider } from '../../providers/chat/chats';

@IonicPage()
@Component({
  selector: 'page-chats',
  templateUrl: 'conversations.html',
})
export class ConversationsChannelsPage {

  public channels: Channel[];
  public loading = true;
  public showChatTypeModal = false;
  public params = 'ChatUserPage';

  constructor(private navCtrl: NavController,
              private chatsProvider: ChatsProvider,
              private navParams: NavParams) {
  }

  async ionViewDidLoad() {
  }

  async ionViewWillEnter() {
    this.channels = await this.chatsProvider.getChannels();
    this.loading = false;
  }

  ionViewDidLeave() {
    this.showChatTypeModal = false;
  }

  selectChatType() {
    this.showChatTypeModal = true;
  }
}
