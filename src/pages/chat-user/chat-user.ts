import {Component, ElementRef, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ChatsProvider} from '../../providers/chat/chats';
import {AngularFireAuth} from 'angularfire2/auth';


/**
 * Generated class for the ChatUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat-user',
  templateUrl: 'chat-user.html',
})
export class ChatUserPage {

  public channel: Channel;
  public user: User;
  public message: string = null;
  public messages: any;

  @ViewChild('content') private content;

  constructor(private chatsProviders: ChatsProvider,
              private firebaseAuth: AngularFireAuth,
              private navCtrl: NavController,
              private navParams: NavParams) {
  }

  ionViewDidLoad() {

  }

  private scrollToBottom(): void {
    setTimeout(() => {
      this.content.scrollToBottom();
    });
  }

  async ionViewWillEnter() {
    this.channel = this.navParams.get('channel');
    this.user = this.channel.homologousUser;

    let channelId = this.channel.uid;
    this.chatsProviders.getMessages(channelId).then(messages => {
      this.messages = messages;
      this.scrollToBottom();
    });

  }

  private async addMessage() {
    let channelId = this.channel.uid;
    await this.chatsProviders.addMessage(this.message, channelId);

    this.message = '';
    this.scrollToBottom();

  }

  private getClass(message: any) {
    const cssClass = (message.userId === this.firebaseAuth.auth.currentUser.uid) ? 'me' : 'you';
    return cssClass;
  }


}
