import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {MyApp} from './app.component';

import {AngularFireModule} from "angularfire2";
import {AngularFireAuthModule} from "angularfire2/auth";
import {AngularFireDatabaseModule} from "angularfire2/database";
import env from "../env";
import {UserProvider} from '../providers/user/user';
import {InvitationsProvider} from '../providers/invitations/invitations';
import {ConnectionProvider} from '../providers/connection/connection';
import {Push} from '@ionic-native/push';
import {PushProvider} from '../providers/push/push';
import {AngularFireStorageModule} from 'angularfire2/storage';
import {Camera} from '@ionic-native/camera';
import {NotificationsProvider} from '../providers/notifications/notifications';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
      mode: 'ios',
      tabsHideOnSubPages: true
    }),
    AngularFireModule.initializeApp(env.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    Push,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserProvider,
    InvitationsProvider,
    ConnectionProvider,
    PushProvider,
    NotificationsProvider,
    Camera
  ]
})
export class AppModule {
}
