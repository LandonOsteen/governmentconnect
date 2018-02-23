import { Component, Input } from '@angular/core';

@Component({
  selector: 'users-list',
  templateUrl: 'users-list.html'
})
export class UsersListComponent {

  @Input('users') users: any[] = [];

  getNavParams(user) {
    return { userId: user.uid }; 
  }

}
