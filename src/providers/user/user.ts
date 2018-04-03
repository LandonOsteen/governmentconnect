import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase} from 'angularfire2/database';
import lunr from "lunr";
import {AngularFireStorage} from 'angularfire2/storage';
import {Camera} from '@ionic-native/camera';

@Injectable()
export class UserProvider {

  usersCache = null;
  usersIndex = null;
  usersWatcher = null;

  constructor(public firebaseAuth: AngularFireAuth,
              public firebaseDatabase: AngularFireDatabase,
              public firebaseStorage: AngularFireStorage,
              public camera: Camera) {
  }

  /**
   * Get user profile information it combines the public and private
   * @param {string} userId
   * @param {boolean} includePrivateData
   * @returns {Promise<{} & any & {}>}
   */
  async getUser(userId: string, includePrivateData?: boolean, forceReload?: boolean) {

    // Get user public data
    const users = await this.getUsers(forceReload);
    let user: User = users[userId];

    // Get user private data
    if (includePrivateData) {
      const privateData = await this.firebaseDatabase
        .object(`users_private/${userId}`)
        .valueChanges()
        .take(1)
        .toPromise() as UserPrivate;
      user.privateData = privateData;
    }

    return user;
  }

  /**
   * Get all users
   * @returns {Promise<any>}
   */
  async getUsers(forceReload?: boolean) {

    if (forceReload) {
      this.usersCache = null;
    }

    if (!this.usersCache) {
      this.usersCache = await this.firebaseDatabase
        .object(`users`)
        .valueChanges()
        .take(1)
        .toPromise();

      if (this.usersCache) {
        // Correct uids
        Object.keys(this.usersCache).map((uid, index) => {
          this.usersCache[uid].uid = uid;
        });
      }

    }

    return this.usersCache;
  }


  /**
   * Update user profile
   * @param {User} user
   * @returns {Promise<{} & void & void>}
   */
  async updateUser(user: User) {

    const hasPrivateData = user.privateData != null;
    if (hasPrivateData) {
      await this.firebaseDatabase
        .object(`users_private/${user.uid}`)
        .update(user.privateData);
      user.privateData = null;
    }


    await this.firebaseDatabase
      .object(`users/${user.uid}`)
      .update(user);

    return await this.getUser(user.uid, hasPrivateData);

  }

  async uploadUserProfilePicture(user: User) {

    const imageURI = await this.camera.getPicture({
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    });

    return await this.firebaseStorage.upload('image', imageURI);

  }

  async searchUsers(query?: string) {
    if (!this.usersIndex) {
      const users = await this.getUsers();

      this.usersIndex = lunr(function () {
        this.ref('uid');

        this.field('firstName');
        this.field('lastName');
        this.field('stafferFor');

        this.pipeline.remove(lunr.stemmer);
        this.searchPipeline.remove(lunr.stemmer);

        Object['values'](users).forEach((user) => {
          this.add(user);
        })
      })

    }

    const results = this.usersIndex.search(query);

    return results
      .map(r => this.usersCache[r.ref])
      .sort((a, b) => {
        if (a.firstName < b.firstName) return -1;
        if (a.firstName > b.firstName) return 1;
        return 0;
      })
  }

}
