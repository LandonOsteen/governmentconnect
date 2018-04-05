import { NgModule } from '@angular/core';
import { ContactsListComponent } from './contacts-list/contacts-list';
import { IonicModule } from 'ionic-angular';
import { UsersListComponent } from './users-list/users-list';
import { ChatListComponent } from './chat-list/chat-list';

@NgModule({
	declarations: [
		ContactsListComponent,
		UsersListComponent,
    ChatListComponent
	],
	imports: [IonicModule],
	exports: [ContactsListComponent,
    UsersListComponent,
    ChatListComponent]
})
export class ComponentsModule {}
