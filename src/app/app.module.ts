import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { MyApp } from './app.component';
import { LoginPage } from "../pages/login/login";
import { CometChatProvider } from '../providers/comet-chat/comet-chat';
import { IonicStorageModule } from "@ionic/storage";

@NgModule({
  declarations: [
    MyApp,
    LoginPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage
  ],
  providers: [
    AndroidPermissions,
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    CometChatProvider
  ]
})
export class AppModule { }
