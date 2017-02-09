import { Component, ViewChild } from '@angular/core'
import { NavController } from 'ionic-angular'
import { StatusBar, Splashscreen } from 'ionic-native'
import { TranslateService } from 'ng2-translate/ng2-translate'
import { AuthService } from '../providers/auth'
import { TabsPage } from '../pages/tabs/tabs'
import { SignInPage } from '../pages/sign-in/sign-in'
import { NewUserPage } from '../pages/new-user/new-user'

@Component({
  template: '<ion-nav #myNav></ion-nav>'
})
export class MyApp {
  @ViewChild('myNav') nav: NavController
  constructor(
    private translate: TranslateService,
    private authService: AuthService) {
    translate.addLangs(['en'])
    translate.setDefaultLang('en')
  }

  ngOnInit(): void {
    this.nav.setRoot(TabsPage)
  }
  
  ngOnInit2(): void {
    this.authService.authEvents.subscribe((status) => {
      if (status === 'noUser') {
        this.nav.setRoot(SignInPage)
      } else if (status === 'newUser') {
        this.translate.use('en')
        this.nav.setRoot(NewUserPage)
      } else if (status === 'returningUser') {
        this.enterApp()
      }
    })
  }

  enterApp(): void {
    let user = this.authService.getUser()
    if ('locale' in user) {
      console.log('root: logging in, switching to ', user.locale)
      this.translate.use(user.locale)
    } else {
      this.translate.use('en')
    }
    this.nav.setRoot(TabsPage)
  }

}