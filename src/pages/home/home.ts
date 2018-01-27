import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import CCCredentials from '../../credentials';
import { Platform } from 'ionic-angular/platform/platform';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  initializing = true
  initializationError = null

  username = ''
  password = ''

  loggedIn = false

  constructor(
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public plt: Platform,
    public zone: NgZone
  ) { }

  initializeCometChat(success, error) {
    window['CCCometChat'].initializeCometChat(
      CCCredentials.cometchat_domain,
      CCCredentials.cometchat_license_key,
      CCCredentials.cometchat_api_key, 
      this.plt.is('ios') ? 'NO' : false,
      success, error
    )
  }

  getCometChatInstance(success, error) {
    window['CCCometChat'].getInstance(success, error)
  }

  ionViewWillEnter() {
    // See https://docs.cometchat.com/cordova-ionic-plugin/initialization/
    if (this.plt.is('ios')) {
      this.initializeCometChat(
        () => { 
          console.log('CometChat has initialized!') 
          this.initializing = false
          this.zone.run(() => {});
        }, function (err) { 
          console.error('Error while initializing CometChat...')
          this.initializing = false
          this.initializationError = err;
          this.zone.run(() => {});
        }
      )
    } else {
      this.getCometChatInstance(() => {
        this.initializeCometChat(
          () => { 
            console.log('CometChat has initialized!') 
            this.initializing = false
            this.zone.run(() => {});
          }, function (err) { 
            console.error('Error while initializing CometChat...')
            this.initializing = false
            this.initializationError = err;
            this.zone.run(() => {});
          }
        )
      }, (err) => {
        console.error('Error getting CometChat instance...')
        this.initializing = false
        this.initializationError = err
        this.zone.run(() => {});
      })
    }
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

  login() {
    const loader = this.loadingCtrl.create();

    loader.present()

    window['CCCometChat'].login(this.username, this.password,
      () => { 
        this.loggedIn = true
        this.zone.run(() => {});
        loader.dismiss()
      }, function (err) { 
        alert('Please try again')
        this.zone.run(() => {});
        loader.dismiss()
      }
    )
  }

}
