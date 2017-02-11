import { Component } from '@angular/core'
import { DataService } from '../../providers/data'

@Component({
  selector: 'lexical-input',
  templateUrl: 'lexical-input.html'
})
export class LexicalInputComponent {
  starttime: string
  endtime: string
  annotation: string
  constructor(
    private dataService:  DataService
  ) {

  }


  isValid() {
    return (this.starttime && this.endtime && this.annotation)
  }

  submit() {
    let document = {
      start: this.starttime,
      end: this.endtime,
      anno: this.annotation
    }
    this.dataService.saveFirebaseEntry('test/data', document)
    .then(() => {
      console.log('saved!')
    })
  }

}
