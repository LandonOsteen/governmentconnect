import { Component, Input } from '@angular/core';

@Component({
  selector: 'group-members',
  templateUrl: 'group-members.html'
})
export class GroupMembersComponent {
  @Input('users') users: any[] = [];

  constructor() {
  }
}
