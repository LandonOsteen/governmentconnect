Government Connect
=================

Welcome to the application repository for [Government Connect](https://governmentconnect.net/).

To get started, ensure that you have the latest Ionic CLI installed, then add a folder at the root of the app directory titled `comet_chat`. Paste your CometChat mobile SDK files into this folder. 

You'll also need to create a `credentials.ts` file within the `src` directory, and it should have the following format:

```javascript
export default {
  'cometchat_domain': 'YOUR_COMET_CHAT_DOMAIN',
  'cometchat_api_key': 'YOUR_COMET_CHAT_API_KEY',
  'cometchat_license_key': 'YOUR_COMET_CHAT_LICENSE_KEY' 
}
```

Then run the following commands:

```bash
npm install
ionic serve
```

This should load the app into your browser for local testing. The native CometChat UI will not be available in this context, but it's useful for smoketesting.

To prepare for on-device deployment, run `ionic cordova prepare`.

To test on-device, you may run `ionic run ios` to fire up an iOS simulator, or `ionic run android` to deploy to a real Android device. In the latter case, you must have a Android device connected to your computer in order to successfully deploy.

To test on iOS, you will need to be using an Apple laptop, though any operating system will work fine for testing with Android.