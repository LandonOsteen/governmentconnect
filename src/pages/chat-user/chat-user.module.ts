import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatUserPage } from './chat-user';
import {PipesModule} from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ChatUserPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatUserPage),
    PipesModule
  ],
})
export class ChatUserPageModule {}
