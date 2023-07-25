
import { NgModule } from '@angular/core';
import {  RouterModule, Routes } from '@angular/router';
import { authguardGuard } from '../../../services/AuthGuard/authguard.guard';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [

  {
    path: '',
    component: DashboardComponent,
    canActivate: [authguardGuard]
  },
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
