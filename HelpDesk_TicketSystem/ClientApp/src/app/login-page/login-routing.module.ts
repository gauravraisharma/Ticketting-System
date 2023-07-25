
import { NgModule } from '@angular/core';
import {  RouterModule, Routes } from '@angular/router';
import { authguardGuard } from '../../services/AuthGuard/authguard.guard';
import { LoginPageComponent } from './login-page.component';
const routes: Routes = [
  {
    path: '',
    component: LoginPageComponent,
    canActivate: [authguardGuard]
  },
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
