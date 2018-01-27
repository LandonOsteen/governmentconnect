import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import CCCredentials from '../../credentials';
import { Platform } from 'ionic-angular/platform/platform';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  initializing = true

  constructor(
    public navCtrl: NavController,
    public plt: Platform,
    public zone: NgZone
  ) { }

  ionViewWillEnter() {
    // See https://docs.cometchat.com/cordova-ionic-plugin/initialization/
    window['CCCometChat'].initializeCometChat(
      CCCredentials.cometchat_domain,
      CCCredentials.cometchat_license_key,
      CCCredentials.cometchat_api_key, 
      this.plt.is('ios') ? 'NO' : false,
      () => { 
        this.initializing = false
        this.zone.run(() => {});
        console.log('CometChat has initialized!') 
      }, function (err) { 
        console.error('Error while initializing CometChat...')
        console.error(err) 
      }
    )
  } 

  launchCometChat() {
    window['CCCometChat'].launchCometChat(
      this.plt.is('ios') ? 'YES' : true, 
      () => { 
        console.log('CometChat has launched!') 
      }, function (err) { 
        console.error('Error while launching CometChat...')
        console.error(err) 
      }
    )
  }

}
