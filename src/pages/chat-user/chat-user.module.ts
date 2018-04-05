import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatUserPage } from './chat-user';

@NgModule({
  declarations: [
    ChatUserPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatUserPage),
  ],
})
export class ChatUserPageModule {}
