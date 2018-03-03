import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ContactsProvider } from '../../providers/contacts/contacts';
import * as _ from "lodash";
import { APP_PAGES } from '../../enums';

@IonicPage()
@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class ContactsPage {

  contacts = null

  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public contactsProvider: ContactsProvider
  ) { }

  ionViewWillEnter() {
    this.contacts = this.contactsProvider.getContacts().map(cs => cs.filter(c => c.active)).take(1)
  }

  openSearchUsersPage() {
    const modal = this.modalCtrl.create(APP_PAGES.SEARCH_USERS_PAGE)

    modal.present()
  }
}
