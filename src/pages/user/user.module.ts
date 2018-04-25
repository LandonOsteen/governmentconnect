import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {UserPage} from './user';
import {ComponentsModule} from '../../components/components.module';
import {ConversationsChannelsPage} from '../conversations/conversations';
import {ChatsPageModule} from '../conversations/conversations.module';
import {LoginPage} from '../login/login';

@NgModule({
  declarations: [
    UserPage,
  ],
  imports: [
    IonicPageModule.forChild(UserPage),
  ],
})
export class UserPageModule {
}
