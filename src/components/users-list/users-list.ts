import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'users-list',
  templateUrl: 'users-list.html'
})
export class UsersListComponent {
  @Input('users') users: any[] = [];
  @Input('loading') loading: boolean = false;
  @Input('pushPage') pushPage: any;
  @Input('isGroupSearch') isGroupSearch: boolean = false;

  public maxSlice = 20;
  public addUserToGroup = false;

  constructor() {
  }

  public getNavParams(user) {
    return {userId: user.uid};
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.users) {
      this.maxSlice = 20;
    }

    console.log(changes.isGroupSearch);

    if (changes.isGroupSearch && changes.isGroupSearch.currentValue) {
      this.addUserToGroup = true;
    }
  }

  doInfinite(infiniteScroll) {
    this.maxSlice = this.maxSlice + 20;

    infiniteScroll.complete();
  }

}
