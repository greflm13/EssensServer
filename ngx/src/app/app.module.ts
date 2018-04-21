import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRouterModule } from './router/app-router.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { EssenComponent } from './essen.component';
import { HttpgetService } from './httpget.service';
import { HttpputService } from './httpput.service';
import { LastWeekComponent } from './last-week/last-week.component';
import { HomeComponent } from './home/home.component';
import { SpeisenComponent } from './speisen/speisen.component';
import { PrintComponent } from './print/print.component';
import { MinesweeperComponent, MinesweeperModalComponent, SaveComponent } from './minesweeper/minesweeper.component';
import { FieldsizeService } from './fieldsize.service';
import { Game2048Component } from './game2048/game2048.component';
import { OstereierComponent } from './ostereier/ostereier.component';

@NgModule({
  declarations: [
    EssenComponent,
    LastWeekComponent,
    HomeComponent,
    SpeisenComponent,
    PrintComponent,
    MinesweeperComponent,
    MinesweeperModalComponent,
    SaveComponent,
    Game2048Component,
    OstereierComponent
  ],
  imports: [
    NgbModule.forRoot(),
    FormsModule,
    BrowserModule,
    HttpModule,
    AppRouterModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [HttpgetService, HttpputService, FieldsizeService],
  entryComponents: [MinesweeperModalComponent, SaveComponent],
  bootstrap: [EssenComponent]
})
export class AppModule {}
