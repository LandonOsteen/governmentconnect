import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';

import {ComponentsModule} from '../../components/components.module';
import {SearchChatsPage} from './search-chats';

@NgModule({
  declarations: [
    SearchChatsPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchChatsPage),
    ComponentsModule
  ],
})
export class SearchUsersPageModule {
}
