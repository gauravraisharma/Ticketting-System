
import { NgModule } from '@angular/core';
import {  RouterModule, Routes } from '@angular/router';
import { authguardGuard } from '../../services/AuthGuard/authguard.guard';
import { LoginPageComponent } from './login/login-page.component';
import { SignUpComponent } from './sign-up/sign-up.component';
const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [authguardGuard]
  },
  {
    path: 'signup',
    component: SignUpComponent,
    canActivate: [authguardGuard]
  },
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class UserAuthenticationRoutingModule { }
