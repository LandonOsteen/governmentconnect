import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import lunr from "lunr";

@Injectable()
export class UserProvider {

  usersCache = null
  usersIndex = null
  usersWatcher = null

  constructor(
    public firebaseAuth: AngularFireAuth,
    public firebaseDatabase: AngularFireDatabase
  ) { }

  async getUser(userId: string) {
    const users = await this.getUsers() 

    return users[userId]
  }

  async getUsers() {
    if (!this.usersCache) {
      const users = await this.firebaseDatabase
        .object(`users`)
        .valueChanges()
        .take(1)
        .toPromise()

      this.usersCache = users
    }

    return this.usersCache
  }

  async searchUsers(query?: string) {
    if (!this.usersIndex) {
      const users = await this.getUsers()

      this.usersIndex = lunr(function () {
        this.ref('uid')

        this.field('firstName'),
        this.field('lastName')
        this.field('stafferFor')

        this.pipeline.remove(lunr.stemmer)
        this.searchPipeline.remove(lunr.stemmer)

        Object['values'](users).forEach((user) => {
          this.add(user)
        })
      })

    }

    const results = this.usersIndex.search(query)

    return results
      .map(r => this.usersCache[r.ref])
      .sort((a, b) => {
        if(a.firstName < b.firstName) return -1;
        if(a.firstName > b.firstName) return 1;
        return 0;
      })
  }

}
