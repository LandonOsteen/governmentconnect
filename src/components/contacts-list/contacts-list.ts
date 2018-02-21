import { Component, Input } from '@angular/core';

@Component({
  selector: 'contacts-list',
  templateUrl: 'contacts-list.html'
})
export class ContactsListComponent {

  @Input('contacts') contacts: any[] = [];

  getNavParams(contact) {
    return { contactId: contact.uid }; 
  }

  constructor() {
    console.log('Hello ContactsListComponent Component');
  }

}
