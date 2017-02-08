import { Component, Input, ViewChild } from '@angular/core'
import { TranslateService } from 'ng2-translate/ng2-translate'
import { DataService } from '../../providers/data'

// This component has two modes, fixed and popup.
// Fixed mode only changes language. Use case: New user screen, no valid user yet.
// popup mode is a fab with a popup list, this calls auth service to set the
// local for the current user. Use case: Profile tab, anywhere else.

@Component({
  selector: 'locale-fab',
  templateUrl: 'locale-fab.html'
})
export class LocaleFabComponent {
  @ViewChild('fab') fab: any
  @Input() mode: string = 'popup'
  langmap: any = {
    'en': {
      fab: 'En'
    },
    'zh-TW': {
      fab: '中文'
    }
  }
  languageList: string[]
  currentLanguage: string = ''
  constructor(
      private dataService: DataService,
      private translate: TranslateService
  ) {}
  ngOnInit() {
    this.languageList = this.translate.getLangs()
  }
  selectLanguage (language: string) {
    this.translate.use(language)
    if (this.mode === 'popup') {
      this.dataService.updateUserData({locale: language})
      this.fab.close()
    }
   }
}
