import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';

@IonicPage()
@Component({
  selector: 'page-search-users',
  templateUrl: 'search-users.html',
})
export class SearchUsersPage {

  users = []
  query = ''

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public userProvider: UserProvider,
    public viewController: ViewController
  ) { }

  async ionViewDidEnter() {
    const users = await this.userProvider.searchUsers(this.query ? this.query + '*' : '*')

    this.users = users
  }

  async onQuery(ev) {
    const users = await this.userProvider.searchUsers(this.query + '*')

    this.users = users
  }

  dismiss() {
    this.viewController.dismiss()
  }
}
