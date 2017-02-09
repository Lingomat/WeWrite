import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  wavesurfer: any = null
  wsaudiourl: string = 'assets/media/goat-human.wav'
  wsaudioblob: Blob = null
  constructor(public navCtrl: NavController) {

  }

  wavesurferInit(event: any): void {
    this.wavesurfer = event.wavesurfer
  }

  filesSelected(event: any):  void {
    if (event.files.length) {
      this.wsaudiourl = null
      this.wsaudioblob = event.files[0]
    }
  }


}
