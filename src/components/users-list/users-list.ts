import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'users-list',
  templateUrl: 'users-list.html'
})
export class UsersListComponent {

  @Input('users') users: any[] = [];
  @Input('loading') loading: boolean = false

  maxSlice = 20

  getNavParams(user) {
    return { userId: user.uid }; 
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.users) {
      this.maxSlice = 20
    }
  }

  doInfinite(infiniteScroll) {
    this.maxSlice = this.maxSlice + 20

    infiniteScroll.complete();
  }

}
