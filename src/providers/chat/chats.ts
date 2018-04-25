import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase} from 'angularfire2/database';
import {Camera} from '@ionic-native/camera';
import lunr from "lunr";

import _ from 'lodash';
import 'rxjs/add/operator/take';
import {UserProvider} from '../user/user';
import 'rxjs/add/operator/take';

import {UUID} from 'angular2-uuid';
import * as firebase from 'firebase';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';


@Injectable()
export class ChatsProvider {

  channelsCache = [];
  channelsIndex = null;

  constructor(private firebaseAuth: AngularFireAuth,
              private firebaseDatabase: AngularFireDatabase,
              private userProvider: UserProvider,
              public camera: Camera) {
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
        this.channelsCache[uid] = channel;
      }
    }

    return channels.sort((a: Channel, b: Channel) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
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

    let seen = {};
    seen[userId] = {seenAt: new Date()};

    let message = {
      uid: messageId,
      userId: userId,
      createdAt: new Date(),
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      text: messageText,
      seen: seen
    };

    await this.firebaseDatabase
      .object(`/conversations/messages/${channelId}/${messageId}`)
      .update(message);
  }


  /**
   *
   * @param {string} channelId
   * @returns {Observable<any[]>}
   */
  getMessages(channelId: string) {
    return this.firebaseDatabase
      .list(`/conversations/messages/${channelId}`, ref => ref.orderByChild('timestamp'))
      .valueChanges();
  }

  public registerMarkAsSeenSubscription(channelId: string, observer: Observable<any[]>): Subscription {
    let lock = false;
    // Mark message as seen
    return observer.subscribe(async (messages: any) => {
      if (lock) {
        return;
      }
      lock = true;
      setTimeout(async () => {
          await this.markMessagesAsSeen(channelId, messages);
          lock = false;
        }, 500
      );
    });
  }

  private async markMessagesAsSeen(channelId: string, res: any) {
    if (!res) {
      return;
    }

    const messages = res as Message[];
    const userId = this.firebaseAuth.auth.currentUser.uid;
    let messageIdsToBeMarked = [];

    for (let i = 0; i < _.size(messages); i++) {
      const message = messages[i];
      const seenAt = message.seen && message.seen[userId];
      const isSeenByMe = seenAt !== undefined;
      if (!isSeenByMe) {
        messageIdsToBeMarked.push(message.uid);
      }
    }

    // console.log(messageIdsToBeMarked);

    for (let i = 0; i < messageIdsToBeMarked.length; i++) {
      const messageId = messageIdsToBeMarked[i];
      await this.firebaseDatabase
        .object(`/conversations/messages/${channelId}/${messageId}/seen/${userId}`)
        .update({seenAt: new Date()});
    }
  }

  async searchChannels(query?: string) {
    if (!this.channelsIndex) {
      const channels = (await this.getChannels()).map((channel: Channel) => {
        channel["homologousUser_firstName"] = channel.homologousUser.firstName;
        channel["homologousUser_lastName"] = channel.homologousUser.lastName;
        return channel;
      });

      this.channelsIndex = lunr(function () {

        this.ref('uid');

        this.field('homologousUser_firstName');
        this.field('homologousUser_lastName');

        this.pipeline.remove(lunr.stemmer);
        this.searchPipeline.remove(lunr.stemmer);

        channels.forEach((channel) => {
          this.add(channel);
        })
      });
    }

    const results = this.channelsIndex.search(query);

    return results
      .map(r => this.channelsCache[r.ref])
      .sort((a: Channel, b: Channel) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      })
  }


}
