import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {UserProvider} from '../../providers/user/user';
import {ConnectionProvider} from '../../providers/connection/connection';
import * as _ from 'lodash/fp';

@IonicPage()
@Component({
  selector: 'page-search-users',
  templateUrl: 'search-users.html',
})
export class SearchUsersPage {

  public users = [];
  public query = '';
  public loading = true;
  private params: { selectionPage?: string, limitOnContacts: boolean };

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public userProvider: UserProvider,
              public connectionProvider: ConnectionProvider,
              public viewController: ViewController) {
  }

  async ionViewDidLoad() {
    this.params = this.navParams.data;

    this.loading = true;
    await this.search();
    this.loading = false;

  }

  private async search() {
    this.users = await this.userProvider.searchUsers(this.query ? this.query + '*' : '*');
    if (this.params && this.params.limitOnContacts) {
      const contactsIds = await this.connectionProvider.getConnectionsIds();
      this.users = this.users.filter((user) => {
        return contactsIds.indexOf(user.uid) !== -1;
      });
    }
  }

  getPushPage() {
    const params = this.params;
    return (params && params.selectionPage) ? params.selectionPage : 'UserPage';
  }

  async onQuery(ev) {
    this.loading = true;
    await this.search();
    this.loading = false;
  }

  dismiss() {
    this.viewController.dismiss();
  }
}
