import { Component } from '@angular/core'
import { NavController, NavParams, ViewController } from 'ionic-angular'

@Component({
  selector: 'page-error',
  templateUrl: 'error.html'
})
export class ErrorPage {
  errorType: string
  errorTrans: string
  errorRaw: string
  constructor(public navCtrl: NavController, private navParams: NavParams, private vc: ViewController) {
    this.errorType = navParams.get('type')
    this.errorTrans = navParams.get('trans')
    this.errorRaw = navParams.get('raw')
  }

  pressedOK() {
    this.vc.dismiss()
  }

}
