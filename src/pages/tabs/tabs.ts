import { Component } from '@angular/core'
import { NavParams } from 'ionic-angular';
import { HoyPage } from '../hoy/hoy';
import { SemanalPage } from '../semanal/semanal';
import { IncidenciaPage } from '../incidencia/incidencia';
import { chatPage } from '../chat/chat';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HoyPage;
  tab2Root = SemanalPage;
  tab3Root = IncidenciaPage;
  tab4Root = chatPage; 
  mySelectedIndex: number;

  constructor(navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }
}
