import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ContactsProvider } from '../../providers/contacts/contacts';
import { UserProvider } from '../../providers/user/user';

@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {

  contact = {}
  user: any = {}

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public contactsProvider: ContactsProvider,
    public userProvider: UserProvider
  ) { }

  async ionViewDidLoad() {
    const userId = this.navParams.get('userId')

    const user = await this.userProvider.getUser(userId)

    this.user = user

    const contact = await this.contactsProvider.getContact(userId)

    console.log(contact)

    this.contact = contact

  }

  revokeConnectionRequest() {
    this.contactsProvider.revokeConnectionRequest(this.user.uid)
  }

}
