import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';

@IonicPage()
@Component({
  selector: 'page-search-users',
  templateUrl: 'search-users.html',
})
export class SearchUsersPage {

  public users = [];
  public query = '';
  public loading = true;
  public isGroupSearch = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public userProvider: UserProvider,
              public viewController: ViewController) {
  }

  async ionViewDidLoad() {
    this.loading = true;
    this.users = await this.userProvider.searchUsers(this.query ? this.query + '*' : '*');
    this.loading = false;

    this.isGroupSearch = this.navParams.get('data') === 'groupSearch';
  }

  getPushPage() {
    return (this.navParams.data) ? this.navParams.data : 'UserPage';
  }

  async onQuery(ev) {
    this.loading = true;

    this.users = await this.userProvider.searchUsers(this.query + '*');

    this.loading = false;
  }

  dismiss() {
    this.viewController.dismiss();
  }
}
