import { Component } from '@angular/core'
import { HomePage } from '../home/home'
import { AboutPage } from '../about/about'
import { ContactPage } from '../contact/contact'

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root: any = HomePage
  tab2Root: any = AboutPage
  tab3Root: any = ContactPage
  enableTabs: boolean = false
  constructor() {
  }
  // Bizarely Ionic haven't fixed this bug. If we try to start with tabs enabled, there will be no tab bar
  ionViewDidEnter() {
    this.enableTabs = true
  }
}
