import { Component, ChangeDetectorRef } from '@angular/core'
import { NavController } from 'ionic-angular'
import { AuthService } from '../../providers/auth'
import { DataService } from '../../providers/data'
import { TranslateService } from 'ng2-translate/ng2-translate'


@Component({
  selector: 'page-new-user',
  templateUrl: 'new-user.html'
})
export class NewUserPage {
  username: string = ''
  tickbox: boolean = false
  constructor(public navCtrl: NavController,
      private authService: AuthService,
      private dataService: DataService, private ref: ChangeDetectorRef,
      private translate: TranslateService) {
        this.init()
  }

  init() {
    let fbUser = this.authService.getFirebaseUser()
    this.username = fbUser.displayName.split(' ')[0]
  }

  canRegister(): boolean {
    return (this.username && this.tickbox)
  }

  changed() {
    console.log(this.tickbox)
    this.ref.detectChanges()
  }

  pressedRegister(): void { 
    this.authService.registerUser(this.username, this.translate.currentLang)
  }
}

