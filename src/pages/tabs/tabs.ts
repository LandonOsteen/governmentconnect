import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  contactsRoot = 'ContactsPage';
  chatsRoot = 'ChatsPage';
  notificationsRoot = 'NotificationsPage';
  settingsRoot = 'SettingsPage';

  constructor(public navCtrl: NavController) {}
}
