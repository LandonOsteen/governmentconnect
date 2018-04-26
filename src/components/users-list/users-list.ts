import { Component, Input, SimpleChanges } from '@angular/core';
import { Events } from 'ionic-angular';
import _ from 'lodash';

@Component({
  selector: 'users-list',
  templateUrl: 'users-list.html'
})
export class UsersListComponent {
  @Input('users') users: any[] = [];
  @Input('loading') loading: boolean = false;
  @Input('pushPage') pushPage: any;
  @Input('multiselect') multiselect: boolean = false;
  public selectedUsers = [];

  public maxSlice = 20;

  constructor(public events: Events) {
  }

  public getNavParams(user) {
    return {userId: user.uid};
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.users) {
      this.maxSlice = 20;
    }
  }

  doInfinite(infiniteScroll) {
    this.maxSlice = this.maxSlice + 20;

    infiniteScroll.complete();
  }

  addUser(user) {
    this.selectedUsers.push(user);

    this.events.publish('multiselect:user', this.selectedUsers);
  }

  isUserSelected(user) {
    return _.includes(this.selectedUsers, user);
  }
}
