import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupChatSettingsPage } from './group-chat-settings';

@NgModule({
  declarations: [
    GroupChatSettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupChatSettingsPage),
  ],
})
export class GroupChatSettingsPageModule {}
