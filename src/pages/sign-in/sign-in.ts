import { Component } from '@angular/core'
import { NavController } from 'ionic-angular'
import { AuthService } from '../../providers/auth'
import { ConnectivityService } from '../../providers/connectivity'

@Component({
  selector: 'page-sign-in',
  templateUrl: 'sign-in.html'
})
export class SignInPage {
  appOnline: boolean
  constructor(public navCtrl: NavController,
    private auth: AuthService) {
  }

  loginWith(event, provider) {
    this.auth.loginWithProvider(event, provider)
  }
}
