import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from '../home/home.component';
import { LastWeekComponent } from '../last-week/last-week.component';
import { SpeisenComponent } from '../speisen/speisen.component';
import { PrintComponent } from '../print/print.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'this-week', component: LastWeekComponent },
  { path: 'essen', component: SpeisenComponent },
  { path: 'print', component: PrintComponent },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRouterModule {}
