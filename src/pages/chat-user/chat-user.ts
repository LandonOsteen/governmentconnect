import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ChatsProvider } from '../../providers/chat/chats';
import { AngularFireAuth } from 'angularfire2/auth';


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
              private navParams: NavParams,
              private loadingCtrl: LoadingController) {
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
      messages.subscribe(() => this.scrollToBottom());
    });
  }

  private focusOnEnterMessage() {

  }

  public async handleTyping(keyCode) {
    if (keyCode == 13) {
      await this.addMessage();
    }
  }

  public async addMessage() {
    let channelId = this.channel.uid;
    await this.chatsProviders.addMessage(this.message, channelId);

    this.message = '';
    this.scrollToBottom();
  }

  public async addPhoto() {
    let loader = this.loadingCtrl.create({
      content: 'Please wait'
    });
    loader.present();

    try {
      const imgUrl = await this.chatsProviders.uploadChatPicture();
      const imgMsg = `<div class="chat-message-image"><img src="${imgUrl}" /></div>`;
      this.message = imgMsg;
      await this.addMessage();
      loader.dismiss();
    } catch (err) {
      console.log('add photo failed', err);
      loader.dismiss();
    }
  }

  public async addFile() {
    try {
      const fileUrl = await this.chatsProviders.uploadChatFile();
    } catch (err) {
      console.log('add file failed', err);
    }
  }

  public getClass(message: any) {
    return (message.userId === this.firebaseAuth.auth.currentUser.uid) ? 'me' : 'you';
  }
}
