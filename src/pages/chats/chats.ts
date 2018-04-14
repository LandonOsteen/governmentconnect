import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html',
})
export class ChatsPage {
  public showChatTypeModal = false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

  ionViewDidLeave() {
    this.showChatTypeModal = false;
  }

  selectChatType() {
    this.showChatTypeModal = true;
  }
}
