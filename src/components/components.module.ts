import { NgModule } from '@angular/core';
import { ContactsListComponent } from './contacts-list/contacts-list';
import { IonicModule } from 'ionic-angular';
import { UsersListComponent } from './users-list/users-list';

@NgModule({
	declarations: [
		ContactsListComponent,
		UsersListComponent
	],
	imports: [IonicModule],
	exports: [ContactsListComponent,
    UsersListComponent]
})
export class ComponentsModule {}
