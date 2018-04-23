import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from '../home/home.component';
import { LastWeekComponent } from '../last-week/last-week.component';
import { SpeisenComponent } from '../speisen/speisen.component';
import { PrintComponent } from '../print/print.component';
import { MinesweeperComponent } from '../minesweeper/minesweeper.component';
import { Game2048Component } from '../game2048/game2048.component';
import { OstereierComponent } from '../ostereier/ostereier.component';
import { TetrisComponent } from '../tetris/tetris.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'this-week', component: LastWeekComponent },
  { path: 'essen', component: SpeisenComponent },
  { path: 'print', component: PrintComponent },
  { path: 'minesweeper', component: MinesweeperComponent },
  { path: '2048', component: Game2048Component },
  { path: 'ostereier', component: OstereierComponent },
  { path: 'tetris', component: TetrisComponent },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRouterModule {}
