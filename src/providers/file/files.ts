import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase} from 'angularfire2/database';
import {AngularFireStorage} from 'angularfire2/storage';
import {Camera} from '@ionic-native/camera';

import _ from 'lodash';
import 'rxjs/add/operator/take';
import {UserProvider} from '../user/user';
import 'rxjs/add/operator/take';

import {UUID} from 'angular2-uuid';
import * as firebase from 'firebase';


@Injectable()
export class FilesProvider {

  constructor(public firebaseStorage: AngularFireStorage,
              public camera: Camera) {
  }

  /**
   * Upload file from camera
   * @returns {Promise<string | (() => Observable<string | null>)>}
   */
  async uploadFromCamera() {
    const fileUUID = UUID.UUID();
    const imageURI = await this.camera.getPicture({
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    });

    const filePath = `${ fileUUID }.jpg`;

    const image = 'data:image/jpg;base64,' + imageURI;
    const result = await this.firebaseStorage.ref(filePath).putString(image, 'data_url');
    return result.downloadURL
  }

  /**
   * Upload file form storage
   * @param file
   * @returns {Promise<{url: string | (() => Observable<string | null>); name}>}
   */
  async uploadFile(file) {
    try {
      const fileUUID = UUID.UUID();
      const fileExt = this.getFileExt(file.name);
      const filePath = fileExt ? `${ fileUUID }.${ fileExt }` : `${ fileUUID }`;
      const upload = await this.firebaseStorage.ref(filePath).put(file);
      const result = {
        url: upload.downloadURL,
        name: file.name
      };

      return result;
    } catch (err) {
      console.log('file upload to server failed', err);
    }
  }

  private getFileExt(file) {
    const pos = file.lastIndexOf('.');
    return (pos !== -1) ? file.substr(file.lastIndexOf('.') + 1) : null;
  }


}
