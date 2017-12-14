import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from '../home/home.component';
import { LastWeekComponent } from '../last-week/last-week.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'last-week', component: LastWeekComponent },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRouterModule { }
