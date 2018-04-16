import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import * as _ from "lodash";
import { APP_PAGES } from '../../enums';
import { ConnectionProvider } from '../../providers/connection/connection';

@IonicPage()
@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class ContactsPage {

  public contacts: Connection[] = null;
  public params = 'UserPage';

  constructor(public modalCtrl: ModalController,
              public navCtrl: NavController,
              public navParams: NavParams,
              public connectionProvider: ConnectionProvider) {
  }

  async ionViewWillEnter() {
    this.contacts = await this.connectionProvider.getConnections();
  }

  openSearchUsersPage() {
    const modal = this.modalCtrl.create(APP_PAGES.SEARCH_USERS_PAGE);
    modal.present()
  }
}
