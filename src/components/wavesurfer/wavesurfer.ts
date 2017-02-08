import { Input, EventEmitter, Output, Component, ViewChild } from '@angular/core'

declare var WaveSurfer // no typescript typings for this mofo

@Component({
  selector: 'wavesurfer',
  templateUrl: 'wavesurfer.html'
})
export class WavesurferComponent {
  @ViewChild('waveform') waveformEl: any
  @ViewChild('timeline') timelineEl: any
  @Input() options: any = {}
  @Input() timeline: boolean = false
  @Input() minimap: boolean = false
  @Output() initialise = new EventEmitter()
  wavesurfer: any
  constructor() {
  }
  ngOnInit() {
    let defOpts = {
      container: this.waveformEl.nativeElement,
      waveColor: '#00796B',
      progressColor: '#009688',
      cursorColor: '#7C4DFF',
      cursorWidth: 2,
      height: 100,  
      scrollParent: true
    }
    let realOpts = Object.assign(defOpts, this.options)
    this.wavesurfer = WaveSurfer.create(realOpts)

    this.wavesurfer.load('assets/media/goat-human.wav');
    this.wavesurfer.on('ready', () => {
      if (this.timeline) {
        this.initTimeline()
      }
      if (this.minimap) {
        this.initMinimap()
      }
      this.initialise.emit({wavesurfer: this.wavesurfer})
    })
  }
  initTimeline() {
    let timeline = Object.create(WaveSurfer.Timeline);
    timeline.init({
      wavesurfer: this.wavesurfer,
      container: this.timelineEl.nativeElement
    })
  }
  initMinimap() {
    this.wavesurfer.initMinimap({
      height: 25,
      waveColor: '#00796B',
      progressColor: '#009688',
      cursorColor: '#7C4DFF'
    })
  }

}
