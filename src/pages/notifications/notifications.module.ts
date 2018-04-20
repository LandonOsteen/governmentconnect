import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationsPage } from './notifications';
import { PipesModule } from '../../pipes/pipes.module';
import {MomentModule} from 'angular2-moment';

@NgModule({
  declarations: [
    NotificationsPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificationsPage),
    PipesModule,
    MomentModule
  ],
})
export class NotificationsPageModule {}
