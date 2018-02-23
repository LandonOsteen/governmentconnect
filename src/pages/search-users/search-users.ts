import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
    public userProvider: UserProvider
  ) { }

  async ionViewDidEnter() {
    const users = await this.userProvider.searchUsers(this.query ? this.query + '*' : '*')

    this.users = users.slice(0,10)
  }

  async onQuery(ev) {
    const users = await this.userProvider.searchUsers(this.query + '*')

    this.users = users.slice(0,10)
  }

}
