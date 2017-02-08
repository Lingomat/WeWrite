import { NgModule, ErrorHandler } from '@angular/core'
import { Http } from '@angular/http'
import { TranslateModule } from 'ng2-translate/ng2-translate'
import { TranslateLoader, TranslateStaticLoader } from 'ng2-translate/src/translate.service'
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular'
// Pages
import { MyApp } from './app.component'
import { AboutPage } from '../pages/about/about'
import { ContactPage } from '../pages/contact/contact'
import { HomePage } from '../pages/home/home'
import { TabsPage } from '../pages/tabs/tabs'
import { SignInPage } from '../pages/sign-in/sign-in'
import { ErrorPage } from '../pages/error/error'
import { NewUserPage } from '../pages/new-user/new-user'
// Components
import { LocaleFabComponent } from '../components/locale-fab/locale-fab'
import { WavesurferComponent } from '../components/wavesurfer/wavesurfer'
import { AudiocontrolComponent } from '../components/audiocontrol/audiocontrol'
// Providers
import { AuthService } from '../providers/auth'
import { DataService } from '../providers/data'
// 3rd party deps
import firebase from 'firebase'

// This comes from the bootstrap script in index.html
declare var environmentConfig

// Because Material Design > iOS :)
export const ionicConfig = {
  iconMode: 'md',
  tabsPlacement: 'bottom',
  backButtonIcon: 'md-arrow-back',
  pageTransition: 'md',
  tabsHideOnSubPages: true,
  tabsHighlight: true
}

// Stuff to make NG2 Translate work, e.g. read translations from json files
export function translateFactory(http: Http) {
  return new TranslateStaticLoader(http, '/assets/i18n', '.json')
}

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    SignInPage,
    NewUserPage,
    LocaleFabComponent,
    WavesurferComponent,
    AudiocontrolComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp, ionicConfig),
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: translateFactory,
      deps: [Http]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    SignInPage,
    NewUserPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    DataService
  ]
})

export class AppModule {
  constructor() {
    console.log('Using ' + environmentConfig.name + ' Firebase configuration.')
    // Configure firebase globally based on the script in index.html (which selects the config based on url domain)
    firebase.initializeApp(environmentConfig.fbConfig)
  }
}
