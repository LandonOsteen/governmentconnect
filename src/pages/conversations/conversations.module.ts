import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConversationsChannelsPage } from './conversations';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ConversationsChannelsPage,
  ],
  imports: [
    IonicPageModule.forChild(ConversationsChannelsPage),
    ComponentsModule
  ],
})
export class ChatsPageModule {
}
