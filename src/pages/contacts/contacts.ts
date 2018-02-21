import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ContactsProvider } from '../../providers/contacts/contacts';

@IonicPage()
@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class ContactsPage {

  contacts = []

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public contactsProvider: ContactsProvider
  ) { }

  ionViewDidLoad() {
    this.contactsProvider.getContacts().first().subscribe((val) => {
      this.contacts = Object['values'](val)
    });
  }

}
