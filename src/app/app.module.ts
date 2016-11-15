import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MyApp } from './app.component';

import { chatPage } from '../pages/chat/chat';
import { detallePage } from '../pages/detalle/detalle';
import { GalleryModalPage } from '../pages/galleryModal/galleryModal';
import { HoyPage } from '../pages/hoy/hoy';
import { HoyPipe } from '../pages/hoy/hoyPipe';
import { IncidenciaPage } from '../pages/incidencia/incidencia';
import { LoginPage } from '../pages/login/login';
import { SemanalPage } from '../pages/semanal/semanal';
import { TabsPage } from '../pages/tabs/tabs';


@NgModule({
  declarations: [
    MyApp,
    chatPage,
    detallePage,
    GalleryModalPage,
    HoyPage,
    HoyPipe,
    IncidenciaPage,
    LoginPage,
    SemanalPage,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    chatPage,
    detallePage,
    GalleryModalPage,
    HoyPage,
    IncidenciaPage,
    LoginPage,
    SemanalPage,
    TabsPage
  ],
  providers: [Storage]
})
export class AppModule {}
