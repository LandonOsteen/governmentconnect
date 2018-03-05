import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WelcomePage } from './welcome';

@NgModule({
  declarations: [
    WelcomePage
  ],
  entryComponents: [
    WelcomePage
  ],
  imports: [
    IonicPageModule.forChild(WelcomePage)
  ],
})
export class WelcomePageModule { }