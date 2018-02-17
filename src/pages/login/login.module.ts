import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';

@NgModule({
  declarations: [
    LoginPage,
  ],
  entryComponents: [
    LoginPage
  ],
  imports: [
    IonicPageModule.forChild(LoginPage),
  ],
})
export class WelcomePageModule {}
