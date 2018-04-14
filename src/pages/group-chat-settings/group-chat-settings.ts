import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-group-chat-settings',
  templateUrl: 'group-chat-settings.html',
})
export class GroupChatSettingsPage {

  public group = {
    name: ''
  };

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

}
