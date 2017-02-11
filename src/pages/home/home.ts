import { Component, ChangeDetectorRef } from '@angular/core';

import { NavController,  } from 'ionic-angular'
import { DataService } from '../../providers/data'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  wavesurfer: any = null
  wsaudiourl: string = 'assets/media/goat-human.wav'
  wsaudioblob: Blob = null
  ourlocalvar: any
  datasub: any
  constructor(
      public navCtrl: NavController,
      private dataService: DataService,
      private ref: ChangeDetectorRef
    ) {

  }

  ngOnInit() {
    // this.dataService.getFirebaseEntry('test/data')
    // .then((snapshot) => {
    //   this.ourlocalvar = snapshot
    //   console.log(snapshot)
    // })
    this.datasub = this.dataService.observeFirebaseObject('test/data')
    .subscribe((snapshot) => {
      this.ourlocalvar = snapshot
      this.ref.detectChanges()
      console.log('update', snapshot)
    })
  }
  ngOnDestroy() {
    this.datasub.unsubscribe()
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
