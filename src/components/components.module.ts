import { NgModule } from '@angular/core';
import { ContactsListComponent } from './contacts-list/contacts-list';
import { IonicModule } from 'ionic-angular';
@NgModule({
	declarations: [ContactsListComponent],
	imports: [IonicModule],
	exports: [ContactsListComponent]
})
export class ComponentsModule {}
