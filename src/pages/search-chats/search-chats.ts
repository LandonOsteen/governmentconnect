import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {UserProvider} from '../../providers/user/user';
import {ChatsProvider} from '../../providers/chat/chats';

@IonicPage()
@Component({
  selector: 'page-search-users',
  templateUrl: 'search-chats.html',
})
export class SearchChatsPage {

  public channels = [];
  public query = '';
  public loading = true;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public chatProvider: ChatsProvider,
              public viewController: ViewController) {
  }

  async ionViewDidLoad() {
    this.loading = true;
    this.channels = await this.chatProvider.searchChannels(this.query ? this.query + '*' : '*');
    this.loading = false;
  }

  getPushPage() {
    return (this.navParams.data) ? this.navParams.data : 'ChatPage';
  }

  async onQuery(ev) {
    this.loading = true;

    this.channels = await this.chatProvider.searchChannels(this.query + '*');
    console.log(this.channels);

    this.loading = false;
  }

  dismiss() {
    this.viewController.dismiss();
  }
}
