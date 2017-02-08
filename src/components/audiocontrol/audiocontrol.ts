import { Input, Component, ChangeDetectorRef } from '@angular/core'

@Component({
  selector: 'audiocontrol',
  templateUrl: 'audiocontrol.html'
})
export class AudiocontrolComponent {
  @Input() wavesurfer: any
  playing: boolean = false
  self: any
  constructor(private ref: ChangeDetectorRef) {
  }

  ws_play() {
    this.playing = true
    this.ref.detectChanges()
  }
  ws_pause() {
    this.playing = false
    this.ref.detectChanges()
  }
  ws_finish() {
    this.playing = false
    this.ref.detectChanges()
  }
  ngOnInit() {
    this.ws_play = this.ws_play.bind(this)
    this.ws_pause = this.ws_pause.bind(this)
    this.ws_finish = this.ws_finish.bind(this)
    this.wavesurfer.on('play', this.ws_play)
    this.wavesurfer.on('pause', this.ws_pause)
    this.wavesurfer.on('finish', this.ws_finish)
  }
  ngOnDestroy() {
    this.wavesurfer.un('play', this.ws_play)
    this.wavesurfer.un('pause', this.ws_pause)
    this.wavesurfer.un('finish', this.ws_finish)
  }


  clickButton() {
    if (this.wavesurfer.isPlaying()) {
      this.wavesurfer.pause()
    } else {
      this.wavesurfer.play()
    }
  }

}
