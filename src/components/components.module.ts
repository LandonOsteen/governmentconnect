import { NgModule } from '@angular/core';
import { ContactsListComponent } from './contacts-list/contacts-list';
import { IonicModule } from 'ionic-angular';
import { UsersListComponent } from './users-list/users-list';
import { ChatListComponent } from './chat-list/chat-list';
import { PipesModule } from '../pipes/pipes.module';
import { MomentModule } from 'angular2-moment';
import { GroupMembersComponent } from './group-members/group-members';

@NgModule({
  declarations: [
    ContactsListComponent,
    UsersListComponent,
    ChatListComponent,
    GroupMembersComponent
  ],
  imports: [
    IonicModule,
    PipesModule,
    MomentModule
  ],
  exports: [ContactsListComponent,
    UsersListComponent,
    ChatListComponent,
    GroupMembersComponent]
})
export class ComponentsModule {
}
