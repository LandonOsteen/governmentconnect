import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ChatUserPage} from './chat-user';
import {PipesModule} from '../../pipes/pipes.module';
import {ComponentsModule} from '../../components/components.module';
import {MomentModule} from 'angular2-moment';

@NgModule({
  declarations: [
    ChatUserPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatUserPage),
    MomentModule
  ],
})
export class ChatUserPageModule {
}
