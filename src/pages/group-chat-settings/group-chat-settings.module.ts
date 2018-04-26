import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupChatSettingsPage } from './group-chat-settings';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    GroupChatSettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupChatSettingsPage),
    ComponentsModule
  ],
})
export class GroupChatSettingsPageModule {
}
