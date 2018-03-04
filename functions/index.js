const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.onConnectionInvitationCreated = functions.database.ref('/invitations/{userId}/{inviterId}').onWrite((event) => {
  const userId = event.params.userId
  const inviterId = event.params.inviterId

  if (!event.data.previous.exists() && event.data.current.exists() && event.data.current.child('active').val() === true) {
    console.log('Sending notification to ', userId)

    const getDeviceTokensPromise = admin.database().ref(`/notification_tokens/${userId}`).once('value');
    const getFollowerProfilePromise = admin.database().ref(`/users/${inviterId}`).once('value')

    return Promise.all([getDeviceTokensPromise, getFollowerProfilePromise]).then((results) => {
      const tokensSnapshot = results[0];
      const inviter = results[1];
  
      // Check if there are any device tokens.
      if (!tokensSnapshot.hasChildren()) {
        return console.log('There are no notification tokens to send to.');
      }

      console.log('There are', tokensSnapshot.numChildren(), 'tokens to send notifications to.');
      console.log('Fetched inviter profile', inviter);
  
      // Notification details.
      const payload = {
        notification: {
          title: 'New connection request!',
          body: `${inviter.child('firstName').val()} ${inviter.child('lastName').val()} has requested to connect with you on Government Connect.`
        },
      };
  
      // Listing all tokens.
      const tokens = Object.keys(tokensSnapshot.val());
  
      // Send notifications to all tokens.
      return admin.messaging().sendToDevice(tokens, payload);
    }).then((response) => {
      // For each message check if there was an error.
      const tokensToRemove = [];

      response.results.forEach((result, index) => {
        const error = result.error;
        if (error) {
          console.error('Failure sending notification to', tokens[index], error);
          // Cleanup the tokens who are not registered anymore.
          if (error.code === 'messaging/invalid-registration-token' || error.code === 'messaging/registration-token-not-registered') {
            tokensToRemove.push(tokensSnapshot.ref.child(tokens[index]).remove());
          }
        }
      });

      return Promise.all(tokensToRemove);
    })
  }
})
