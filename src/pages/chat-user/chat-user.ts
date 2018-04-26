import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ChatsProvider } from '../../providers/chat/chats';
import { AngularFireAuth } from 'angularfire2/auth';
import { FilesProvider } from '../../providers/file/files';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import * as _ from 'lodash';
import {APP_PAGES} from '../../enums';
import {NotificationsProvider} from '../../providers/notifications/notifications';

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
  public message: string = null;
  public messages: Observable<any>;

  private subscriptionMessage: Subscription;
  private subscriptionMarkAsSeen: Subscription;

  @ViewChild('content') private content;
  @ViewChild("file") public fileInput: ElementRef;

  constructor(private chatsProviders: ChatsProvider,
              private filesProviders: FilesProvider,
              private firebaseAuth: AngularFireAuth,
              private navCtrl: NavController,
              private navParams: NavParams,
              private chatsProvider: ChatsProvider,
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


    let userId = this.navParams.get('userId');
    if (userId) {
      this.channel = await this.chatsProviders.startChat([userId]);
    } else {
      this.channel = this.navParams.get('channel');
    }


    let channelId = this.channel.uid;
    this.messages = this.chatsProviders.getMessages(channelId);
    this.subscriptionMessage = this.messages.subscribe(messages => {
      this.scrollToBottom();
    });
    this.subscriptionMarkAsSeen = this.chatsProviders.registerMarkAsSeenSubscription(channelId, this.messages);

  }

  async ionViewWillLeave() {
    this.subscriptionMessage.unsubscribe();
    this.subscriptionMarkAsSeen.unsubscribe();
  }

  public async onFileChange(event) {
    let loader = this.loadingCtrl.create({
      content: 'Please wait'
    });
    loader.present();

    try {
      const file: File = event.target.files[0];
      const res = await this.filesProviders.uploadFile(file);

      const fileMsg = `<div class="chat-message-file"><span class="chat-file-icon"></span><a href="${res.url}" target="_blank">${res.name}</a></div>`;
      this.message = fileMsg;
      await this.addMessage();
      loader.dismiss();
    } catch (err) {
      console.log('add file failed', err);
      loader.dismiss();
    }
  }

  public async handleTyping(keyCode) {
    if (keyCode == 13) {
      await this.addMessage();
    }
  }

  public getSeenCount(message: Message) {
    return _.size(message.seen);
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
      const imgUrl = await this.filesProviders.uploadFromCamera();
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
    this.fileInput.nativeElement.click();
  }

  public getClass(message: any) {
    return (message.userId === this.firebaseAuth.auth.currentUser.uid) ? 'me' : 'you';
  }
}
