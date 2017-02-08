import { Injectable } from '@angular/core'
import { Http } from '@angular/http'
import firebase from 'firebase'

@Injectable()
export class DataService {
  bump: number = 0                        // used for datestamp generation: collision detection
  lastTime: number = new Date().getTime() // used for datastamp generation
  fbUser: firebase.User 
  constructor(
    private http: Http
    ) {

  }
  setFirebaseUser(fbUser: firebase.User) {
    this.fbUser = fbUser
  }

  // Even a basic firebase one-shot ought to be in the data service
  getFirebaseEntry(dbPath: string): Promise<any> {
    const fbRef = firebase.database().ref(dbPath)
    return new Promise((resolve, reject) => {
      fbRef.once('value').then((snapshot) => {
        resolve(snapshot.val())
      }).catch((err) => {
        console.log('data: Err! getFirebaseEntry() failed for', dbPath, err)
        reject(err)
      })
    })
  }

  // simple wrapper around firebase set()
  saveFirebaseEntry(savePath: string, document: any): Promise<any> {
    delete document['_rev']
    return new Promise((resolve, reject) => {
      const fbRef = firebase.database().ref(savePath)
      fbRef.set(document).then(() => {
        resolve()
      }).catch((err) => {
        console.log('data: Err! saveFirebaseEntry() could not save fb db path', savePath, err)
        resolve()
      })
    })
  }

  // A basic upload function used by the sync service for upload files
  // If the file is an image then it turns safesearch and sets the metadata
  // field appropriately
  saveFirebaseFile(metadata: any, fileBlob: Blob): {done: Promise<any>, path: string} {
    let databasePath = 'file/' + this.fbUser.uid + '/' + this.getTimeStamp()
    const fbStoreRef = firebase.storage().ref(databasePath)
    let fileType = fileBlob.type.split('/')[0]
    let storeProm = fbStoreRef.put(fileBlob)
    .then((snapshot) => {
      console.log('data:', databasePath, 'upload complete')
      metadata.downloadURL = snapshot.downloadURL
    })
    let dbProm = this.saveFirebaseEntry(databasePath, metadata)
    return {
      done: Promise.all([
        storeProm,
        dbProm
      ]),
      path: databasePath
    }
  }

  deleteFirebaseFile(savePath: string): Promise<any> {
    return Promise.all([
      this.deleteFirebaseDbEntry(savePath),
      this.deleteFirebaseStorageEntry(savePath)
    ])
  }

  deleteFirebaseDbEntry(deletePath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const fbRef = firebase.database().ref(deletePath)
      fbRef.remove().then(() => {
        resolve()
      }).catch((err) => {
        console.log('data: deleteFirebaseDbEntry() could not delete fb db path', deletePath, err)
        // unclear what errors are, firebase docs don't say
        resolve()
      })
    })
  }
  // If we try to delete a file and it doesn't exist, Firebase spazzes out 
  // so this function only rejects if the error is other than object-not-found
  deleteFirebaseStorageEntry(deletePath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const fbRef = firebase.storage().ref(deletePath)
      fbRef.delete().then(() => {
        resolve()
      }).catch((err) => {
        if (err['code'] === 'storage/object-not-found') {
          console.log(err['message'])
          resolve()
        } else {
          console.log(err['code'], err['message'])
          reject()
        }
      })
    })
  }

  // need to avoid collisions, so ms * 10 with an increment
  getTimeStamp(): string {
    let ms = new Date().getTime()
    if (ms === this.lastTime) {
      ++this.bump
    } else {
      this.bump = 0
      this.lastTime = ms
    }
    return ((ms * 10) + this.bump).toString()
  }

  // This function is called post user registration
  // The purpose is to clone the user's public profile image from their social log-in to a file on Firebase
  copyProfileImage(): Promise<any> {
    return new Promise((resolve) => {
      if (!this.fbUser.photoURL) {
        resolve()
      }
      let oReq = new XMLHttpRequest()
      oReq.open("GET", this.fbUser.photoURL, true)
      oReq.responseType = "blob"
      oReq.onload = (oEvent) => {
        if (oReq.status !== 200) {
          resolve()
        }
        let save = this.saveFirebaseFile({desc: 'User profile picture'}, oReq.response)
        save.done.then(()=> {
          // add a photoId property in our user id. Any component accessing user data should try use this first
          this.updateUserData({
            photoId: save.path
          })
          resolve()
        })
      }
      oReq.onerror = (error) => {
        console.log('data: Err! copyProfileImage() cant fetch image', error)
        resolve()
      }
      oReq.send()
    })
  }

  setUserData(newData: any): firebase.Promise<any> {
    const fbRef = this._getUserDataRef()
    return fbRef.set(newData)
  }

  updateUserData(newData: any): firebase.Promise<any> {
    const fbRef = this._getUserDataRef()
    return fbRef.update(newData)
  }

  _getUserDataRef() {
    if (!this.fbUser) {
      throw new Error('auth: FATAL ERROR! Attempted _getUserDataRef() without firebase authorisation')
    }
    return firebase.database().ref('users/' + this.fbUser.uid)
  }
}
