import { Component, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core'

@Component({
  selector: 'file-input',
  templateUrl: 'file-input.html'
})
export class FileInputComponent {
  @Input() buttontext: string = null
  @Input() multiple: boolean = false
  @Input() buttonicon: string = "folder-open"
  @Input() filetype: string
  @Output() selected = new EventEmitter()
  @ViewChild("fileinput") nativeInputBtn: ElementRef
  acceptstring: string = ''
  constructor() {
  }

  ngOnInit() {
    if (!this.buttontext) {
      this.buttontext = this.multiple ? 'FILEINPUT.SELECTMANY' : 'FILEINPUT.SELECT1'
    }
    if (this.filetype === 'image') {
      this.acceptstring = "image/png, image/webp, image/jpeg, image/gif"
    } else if (this.filetype === 'audio') {
      this.acceptstring = "audio/wav, audio/mp3, audio/ogg"
    } else {
      this.acceptstring = "*"
    }
  }

  openDialog(): void {
    this.nativeInputBtn.nativeElement.click()
  }

  fileChange(event): void {
    this.selected.emit({files: event.target.files})
  }

}
