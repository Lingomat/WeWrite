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
  @Input() audioblob: Blob = null
  @Input() audiourl: string = null
  @Output() initialise = new EventEmitter()
  wavesurfer: any
  initialised: boolean = false
  constructor() {
  }

  ngOnChanges(changes) {
    // Changes fires before ngOnInit for the initial attributes.
    if (!this.initialised) {
      return
    }
    if ('audioblob' in changes && this.audioblob) {
      this.wavesurfer.loadBlob(this.audioblob)
    } else if ('audiourl' in changes && this.audiourl) {
      this.wavesurfer.load(this.audiourl)
    }
  }

  ngOnInit() {
    let defOpts = {
      container: this.waveformEl.nativeElement,
      waveColor: '#00796B',
      progressColor: '#009688',
      cursorColor: '#7C4DFF',
      cursorWidth: 2,
      backend: 'WebAudio',
      height: 100,  
      scrollParent: true
    }
    let realOpts = Object.assign(defOpts, this.options)
    this.wavesurfer = WaveSurfer.create(realOpts)
    this.wavesurfer.on('ready', () => {
      // This seems bugged, will look into it later - Mat
      if (this.timeline) {
        this.initTimeline()
      }
      if (this.minimap) {
        this.initMinimap()
      }
      this.initialise.emit({wavesurfer: this.wavesurfer})
    })
    if (this.audiourl) {
      this.wavesurfer.load(this.audiourl)
    } else if (this.audioblob) {
      this.wavesurfer.loadBlob(this.audioblob)
    }
    this.initialised = true
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
