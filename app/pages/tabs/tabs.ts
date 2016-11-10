import {Component} from '@angular/core'
import {HoyPage} from '../hoy/hoy';
import {SemanalPage} from '../semanal/semanal';
import {IncidenciaPage} from '../incidencia/incidencia';
import {chatPage} from '../chat/chat';

@Component({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {

  private tab1Root: any;
  private tab2Root: any;
  private tab3Root: any;
  private tab4Root: any;

  constructor() {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.tab1Root = HoyPage;
    this.tab2Root = SemanalPage;
    this.tab3Root = IncidenciaPage;
    this.tab4Root = chatPage; 

  }
}
