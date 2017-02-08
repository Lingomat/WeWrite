import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  wavesurfer: any = null
  constructor(public navCtrl: NavController) {

  }

  wavesurferInit(event: any) {
    this.wavesurfer = event.wavesurfer
  }


}
