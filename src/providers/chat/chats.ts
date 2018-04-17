import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { Camera } from '@ionic-native/camera';
import { IOSFilePicker } from '@ionic-native/file-picker';

import _ from 'lodash';
import 'rxjs/add/operator/take';
import { UserProvider } from '../user/user';
import 'rxjs/add/operator/take';

import { UUID } from 'angular2-uuid';
import * as firebase from 'firebase';


@Injectable()
export class ChatsProvider {

  constructor(private firebaseAuth: AngularFireAuth,
              private firebaseDatabase: AngularFireDatabase,
              public firebaseStorage: AngularFireStorage,
              private userProvider: UserProvider,
              public camera: Camera,
              private filePicker: IOSFilePicker) {
  }

  /**
   * Create new channel and add into it
   * @param {string} userId
   */
  async createChannel(userId?: string) {

    if (!userId) {
      userId = this.firebaseAuth.auth.currentUser.uid;
    }

    let channelId = UUID.UUID();

    await this.firebaseDatabase
      .object(`conversations/channels/${channelId}`)
      .update({
        uid: channelId,
        ownerId: userId,
        createdAt: new Date(),
        lastMessageAt: new Date(),
        participants: [userId]
      });

    await this.joinChannel(channelId, userId);

    return channelId;
  }

  /**
   * Join user on channel
   * @param {string} userId
   * @param {string} channelId
   * @returns {Promise<void>}
   */
  async joinChannel(channelId: string, userId?: string) {

    if (!userId) {
      userId = this.firebaseAuth.auth.currentUser.uid;
    }

    // Add user to participants
    let participants: string[] = await this.firebaseDatabase
      .object(`conversations/channels/${channelId}/participants`)
      .valueChanges()
      .take(1)
      .toPromise() as string[];
    participants.push(userId);
    await this.firebaseDatabase
      .object(`conversations/channels/${channelId}/participants`)
      .update(_.uniq(participants));

    await this.firebaseDatabase
      .object(`conversations/users/${userId}/${channelId}`)
      .update({
        channelId: channelId,
        createdAt: new Date(),
      });
  }

  /**
   * Get all channel where user has joined
   * @param {string} userId
   * @returns {Promise<any[]>}
   */
  async getChannels(userId?: string) {

    if (!userId) {
      userId = this.firebaseAuth.auth.currentUser.uid;
    }

    let userChannels = await this.firebaseDatabase
      .object(`conversations/users/${userId}`)
      .valueChanges()
      .take(1)
      .toPromise();

    let channels: Channel[] = [];

    if (userChannels) {

      for (let uid in userChannels) {

        let channelId = userChannels[uid].channelId;
        let channel = await this.firebaseDatabase
          .object(`conversations/channels/${channelId}`)
          .valueChanges()
          .take(1)
          .toPromise() as Channel;

        let homologousUserId = channel.participants.filter(participant => participant !== userId)[0];
        channel.homologousUser = await this.userProvider.getUser(homologousUserId);
        channels.push(channel);
      }
    }

    return channels;
  }


  /**
   *Find conversation with specified user
   * @param {string} userId
   * @returns {Promise<boolean>}
   */
  async findConversationWithUser(userId?: string) {

    let channels = await this.getChannels();

    for (let i in channels) {
      let participants = channels[i].participants;
      if (participants.indexOf(userId) !== -1) {
        return channels[i];
      }
    }

    return null;
  }

  /**
   * Check if current user has started a conversation with the specified user
   * @param {string} userId
   * @returns {Promise<boolean>}
   */
  async isInConversationWithUser(userId?: string) {
    let channel = await this.findConversationWithUser(userId);
    return channel != null;
  }


  /**
   * Add message
   * @param {string} messageText
   * @param {string} channelId
   * @param {string} userId
   * @returns {Promise<void>}
   */
  async addMessage(messageText: string, channelId: string, userId?: string) {
    if (!userId) {
      userId = this.firebaseAuth.auth.currentUser.uid;
    }

    let messageId = UUID.UUID();

    let message = {
      uid: messageId,
      userId: userId,
      createdAt: new Date(),
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      text: messageText,
      seen: {}
    };

    await this.firebaseDatabase
      .object(`/conversations/messages/${channelId}/${messageId}`)
      .update(message);
  }


  /**
   *
   * @param {string} channelId
   * @returns {Promise<any[]>}
   */
  async getMessages(channelId: string) {

    const promise = await this.firebaseDatabase
      .list(`/conversations/messages/${channelId}`, ref => ref.orderByChild('timestamp'))
      .valueChanges();

    // Mark message as seen
    promise.subscribe((res: any) => {
      if (!res) {
        return;
      }

      const message = res as Message;
      const userId = this.firebaseAuth.auth.currentUser.uid;

      for (let i = 0; i < _.size(message); i++) {
        // console.log(message[i].uid, message[i]);
        const isSeenByMe = message[i].seen && message[i].seen[userId];

        if (!isSeenByMe) {
          // this.markMessageAsSeen(channelId, message[i].uid, userId);
        }
      }
    });

    return promise;
  }

  /**
   * Mark message as seen
   * @param {string} channelId
   * @param {string} messageId
   * @param {string} userId
   * @returns {Promise<void>}
   */
  async markMessageAsSeen(channelId: string, messageId: string, userId: string) {
    return await this.firebaseDatabase
      .object(`/conversations/messages/${channelId}/${messageId}/seen/${userId}`)
      .update({seenAt: new Date()});
  }

  async uploadChatPicture() {
    const imageURI = await this.camera.getPicture({
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    });

    const filePath = `chat_image_${ new Date().getTime() }.jpg`;

    const image = 'data:image/jpg;base64,' + imageURI;
    const result = await this.firebaseStorage.ref(filePath).putString(image, 'data_url');
    return result.downloadURL
  }

  async uploadChatFile() {
    const fileUri = await this.filePicker.pickFile()
      .then(uri => console.log(uri))
      .catch(err => console.log('Error: ', err));

    console.log('uri file:', fileUri);

    return fileUri;
  }
}