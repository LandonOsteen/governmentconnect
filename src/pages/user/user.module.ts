import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {UserPage} from './user';
import {ComponentsModule} from '../../components/components.module';
import {ChatsPage} from '../chats/chats';
import {ChatsPageModule} from '../chats/chats.module';
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
