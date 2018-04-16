import {NgModule} from '@angular/core';
import {ContactsListComponent} from './contacts-list/contacts-list';
import {IonicModule} from 'ionic-angular';
import {UsersListComponent} from './users-list/users-list';
import {ChatListComponent} from './chat-list/chat-list';
import {PipesModule} from '../pipes/pipes.module';

@NgModule({
  declarations: [
    ContactsListComponent,
    UsersListComponent,
    ChatListComponent
  ],
  imports: [
    IonicModule,
    PipesModule
  ],
  exports: [ContactsListComponent,
    UsersListComponent,
    ChatListComponent]
})
export class ComponentsModule {
}
