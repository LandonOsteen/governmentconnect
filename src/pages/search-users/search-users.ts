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
  loading = true

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public userProvider: UserProvider,
    public viewController: ViewController
  ) { }

  async ionViewDidLoad() {
    this.loading = true

    const users = await this.userProvider.searchUsers(this.query ? this.query + '*' : '*')

    this.users = users

    this.loading = false
  }

  async onQuery(ev) {
    this.loading = true

    const users = await this.userProvider.searchUsers(this.query + '*')

    this.users = users

    this.loading = false
  }

  dismiss() {
    this.viewController.dismiss()
  }
}
