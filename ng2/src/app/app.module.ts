import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HttpgetService } from './httpget.service';
import { HttpputService } from './httpput.service';

@NgModule({
  declarations: [AppComponent],
  imports: [NgbModule.forRoot(), FormsModule, BrowserModule, HttpModule],
  providers: [HttpgetService, HttpputService],
  bootstrap: [AppComponent]
})
export class AppModule { }
