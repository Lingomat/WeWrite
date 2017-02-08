import { Injectable } from '@angular/core'
import 'rxjs/add/operator/map'
import { Platform } from 'ionic-angular'
import { Subject } from 'rxjs/Subject'
import { PopoverController } from 'ionic-angular'
import { ErrorPage } from '../pages/error/error'
import { Location } from '@angular/common'
import firebase from 'firebase'
import { Observable } from 'rxjs/Observable'
import { DataService } from '../providers/data'

export interface AppUser {
  uid: string
  joined: number
  displayName: string
  email: string
  locale: string
  photoId?: string
  photoURL: string
  uiLang: string
  userName: string
}

@Injectable()
export class AuthService {
  user: AppUser = null
  fbUser: firebase.User
  authEventsSub: Subject<any>
  authEvents: Observable<string>
  isAuthorized: boolean = false
  isRegistered: boolean = false
  fbauthed: boolean = false
  constructor(
      private dataService: DataService,
      private popoverCtrl: PopoverController,
      private location: Location) {
    this.authEventsSub = new Subject()
    this.authEvents = this.authEventsSub.asObservable()
    this.init()
  }
  init() {
    firebase.auth().onAuthStateChanged((user) => {
      this.fbUser = user
      if (user) {
        this.fbUser = user

        console.log('auth: Firebase auth', user.uid)
        this.attemptLogin(user)
      } else if (!user) {
        this._performLogout()
      }
    })
  }
  attemptLogin(user: firebase.User) {
    this.dataService.setFirebaseUser(user)
    this.isAuthorized = true
    let pRef = 'users/' + user.uid
    const fbRef = firebase.database().ref(pRef)
    fbRef.once('value').then((snapshot) => {
      let userData = snapshot.val()
      if (!userData) {
        this.isRegistered = true
        this.authEventsSub.next('newUser')
      } else {
        this.authEventsSub.next('returningUser')
      }
    })
  }

  getUser(): AppUser {
    return this.user
  }
  getFirebaseUser(): firebase.User {
    return this.fbUser
  }

  // This could account for Cordova login path for hybrid builds...
  loginWithProvider(event, provider) {
    let authProvider
    if (provider === 'google') {
      authProvider = new firebase.auth.GoogleAuthProvider()
    } else if (provider === 'facebook'){
      authProvider = new firebase.auth.FacebookAuthProvider()
    }
    firebase.auth().signInWithRedirect(authProvider)
  }
  
  _popupError(event, errorMsg) {
    let popover = this.popoverCtrl.create(ErrorPage, {
      type: 'ERROR.SIGNIN',
      trans: 'ERROR.MESSAGE',
      raw: errorMsg
    }, {cssClass: 'popover'})
    popover.present({ev: event})
  }

  logout() {
    firebase.auth().signOut()
  }

  // keep this
  getUserId(): string {
    return this.fbUser ? this.fbUser.uid : null
  }

  // RegisterUser triggers loadUserData() which will eventually emit returningUser event
  // which app.component.ts will use to navigate to the app home (tabs)
  registerUser(userName: string, locale: string): firebase.Promise<any> {
    let newUserData = {
      uid: this.fbUser.uid,
      userName: userName,
      locale: locale,
      email: this.fbUser.email,
      photoURL: this.fbUser.photoURL,
      displayName: this.fbUser.displayName,
      joined: new Date().getTime(),
      uiLang: window.navigator.language
    }
    this.authEventsSub.next('returningUser')
    return this.dataService.setUserData(newUserData).then(() => {
      // We do this because Google severely rate-limits access to the public profile image URL
      this.dataService.copyProfileImage()
    })
  }

  _performLogout() {
    this.dataService.setFirebaseUser(null)
    this.user = null
    this.isAuthorized = false
    this.isRegistered = false
    this.authEventsSub.next('noUser') // we logged out
  }

}

