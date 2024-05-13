
import { NgModule } from '@angular/core';
import {  RouterModule, Routes } from '@angular/router';
import { authguardGuard } from '../../services/AuthGuard/authguard.guard';
import { ConnectWithClientComponent } from './connectwithclient/connectwithClient.component';
const routes: Routes = [
  {
    path: '',
    component: ConnectWithClientComponent,
    canActivate: [authguardGuard]
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class connectwithClientRoutingModule { }
