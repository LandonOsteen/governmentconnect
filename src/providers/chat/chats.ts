import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import _ from 'lodash';
import 'rxjs/add/operator/take';
import { UserProvider } from '../user/user';
import 'rxjs/add/operator/take';
import { UUID } from 'angular2-uuid';

@Injectable()
export class ChatsProvider {

  constructor(private firebaseAuth: AngularFireAuth,
              private firebaseDatabase: AngularFireDatabase,
              private userProvider: UserProvider) {
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
        ownerId: userId,
        createdAt: new Date(),
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
    Object.keys(userChannels).map(async (uid, index) => {

      let channelId = userChannels[uid].channelId;
      console.log(`conversations/channels/${channelId}`);

      let channel = await this.firebaseDatabase
        .object(`conversations/channels/${channelId}`)
        .valueChanges()
        .take(1)
        .toPromise() as Channel;

      let homologousUserId = channel.participants.filter(participant => participant !== userId)[0];
      channel.homologousUser = await this.userProvider.getUser(homologousUserId);
      channels.push(channel);

    });

    console.log(channels);
    return channels;

  }

  async addMessage(message: Message, channelId: string, userId?: string) {

    if (!userId) {
      userId = this.firebaseAuth.auth.currentUser.uid;
    }

    let messageId = UUID.UUID();
    message.uid = messageId;
    message.userId = userId;

    await this.firebaseDatabase
      .object(`/conversations/messages/${channelId}/${messageId}`)
      .update(message);

    await this.joinChannel(userId, channelId);
  }

  // async getUserChannels(userId: string) {
  //
  //   let users = await this.firebaseDatabase
  //     .object(`/conversations/users/${userId}`)
  //     .valueChanges()
  //     .take(1)
  //     .toPromise();
  //
  //   Object.keys(notifications).map(async (uid, index) => {
  //     if (notifications[uid].actorType === 'user') {
  //       notifications[uid].actor = await this.userProvider.getUser(notifications[uid].actorId);
  //     }
  //     result.push(notifications[uid]);
  //   });
  //
  // }

  // async getConversations() {
  //   const user = this.firebaseAuth.auth.currentUser;
  //   const userId = user.uid;
  //
  //   const converations = await this.firebaseDatabase
  //     .object(`conversations/${userId}`)
  //     .valueChanges()
  //     .take(1)
  //     .toPromise();
  //
  //   let result = [];
  //   if (converations) {
  //     Object.keys(converations).map(async (uid, index) => {
  //       converations[uid].owner = await this.userProvider.getUser(converations[uid].ownerId);
  //
  //
  //       converations[uid].chats = [];
  //       for (let i = 0; i < converations[uid].chatIds.length; i++) {
  //
  //         let
  //
  //           converations
  //         [uid].chats.push();
  //       }
  //
  //
  //       result.push(converations[uid]);
  //     });
  //   }
  //   return result;
  //
  //
  // }

}
