import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular/platform/platform';
import CCCredentials from "../../credentials";
import { AndroidPermissions } from '@ionic-native/android-permissions';

declare var CCCometChat;

const ANDROID_PERMISSIONS = [
  'android.permission.INTERNET',
  'android.permission.CHANGE_NETWORK_STATE',
  'android.permission.ACCESS_NETWORK_STATE',
  'android.permission.ACCESS_WIFI_STATE',
  'android.permission.WRITE_INTERNAL_STORAGE',
  'android.permission.READ_INTERNAL_STORAGE',
  'android.permission.READ_EXTERNAL_STORAGE',
  'android.permission.WRITE_EXTERNAL_STORAGE',
  'android.permission.CAMERA',
  'android.permission.RECORD_AUDIO',
  'android.permission.WAKE_LOCK',
  'android.permission.VIBRATE',
  'android.permission.RECEIVE_BOOT_COMPLETED',
  'android.permission.READ_CONTACTS',
  'android.permission.GET_ACCOUNTS',
  'android.permission.SEND_SMS',
  'android.permission.MODIFY_AUDIO_SETTINGS',
  'android.permission.USE_CREDENTIALS',
  'android.permission.READ_PHONE_STATE',
  'com.google.android.providers.gsf.permission.READ_GSERVICES',
  'com.google.android.c2dm.permission.RECEIVE'
]

@Injectable()
export class CometChatProvider {

  initialized = false

  constructor(
    public plt: Platform,
    public androidPermissions: AndroidPermissions
  ) { }

  private async _getInstance() {
    if (this.plt.is('core') || this.plt.is('mobileweb')) {
      // Fake out initialization for testing in Ionic Serve.
      return await new Promise((resolve) => setTimeout(resolve, 2000))
    }

    return new Promise((resolve, reject) => {
      CCCometChat.getInstance(resolve, reject)
    })
  }

  private async _initialize() {
    if (this.plt.is('core') || this.plt.is('mobileweb')) {
      // Fake out initialization for testing in Ionic Serve.
      return await new Promise((resolve) => setTimeout(resolve, 2000))
    }

    return new Promise((resolve, reject) => {
      CCCometChat.initializeCometChat(
        CCCredentials.cometchat_domain,
        CCCredentials.cometchat_license_key,
        CCCredentials.cometchat_api_key,
        this.plt.is('ios') ? 'NO' : false,
        resolve, reject
      )
    })
  }

  async initialize() {
    if (this.initialized) {
      return Promise.resolve()
    }

    if (this.plt.is('android')) {
      await this._getInstance()
    }

    await this._initialize()

    this.initialized = true
  }

  private async _launch() {
    return new Promise((resolve, reject) => {
      CCCometChat.launchCometChat(
        this.plt.is('ios') ? 'YES' : true,
        resolve, reject
      )
    })
  }

  async launch() {
    await this.initialize()

    if (this.plt.is('core') || this.plt.is('mobileweb')) {
      // Fake out login for testing in Ionic Serve.
      return await new Promise((resolve) => setTimeout(resolve, 2000))
    }

    if (this.plt.is('android')) {
      await this.androidPermissions.requestPermissions(ANDROID_PERMISSIONS)
    }

    return await this._launch()
  }

  async login(username: string, password: string) {
    await this.initialize()

    if (this.plt.is('core') || this.plt.is('mobileweb')) {
      // Fake out login for testing in Ionic Serve.
      return await new Promise((resolve) => setTimeout(resolve, 2000))
    }

    return new Promise((resolve, reject) => {
      CCCometChat.login(username, password, resolve, reject)
    })
  }

  async logout() {
    if (this.plt.is('core') || this.plt.is('mobileweb')) {
      // Fake out login for testing in Ionic Serve.
      return await new Promise((resolve) => setTimeout(resolve, 2000))
    }

    return new Promise((resolve, reject) => {
      CCCometChat.logout(resolve, reject)
    })
  }
}
