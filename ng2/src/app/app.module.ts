import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRouterModule } from './router/app-router.module';

import { AppComponent } from './app.component';
import { HttpgetService } from './httpget.service';
import { HttpputService } from './httpput.service';
import { LastWeekComponent } from './last-week/last-week.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [AppComponent, LastWeekComponent, HomeComponent],
  imports: [NgbModule.forRoot(), FormsModule, BrowserModule, HttpModule, AppRouterModule],
  providers: [HttpgetService, HttpputService],
  bootstrap: [AppComponent]
})
export class AppModule { }
