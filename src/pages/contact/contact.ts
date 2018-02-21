import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ContactsProvider } from '../../providers/contacts/contacts';

@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {

  contact = {}

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public contactsProvider: ContactsProvider
  ) { }

  async ionViewDidLoad() {
    const contactId = this.navParams.get('contactId')

    const res = await this.contactsProvider.getContact(contactId)

    this.contact = res
  }

}
