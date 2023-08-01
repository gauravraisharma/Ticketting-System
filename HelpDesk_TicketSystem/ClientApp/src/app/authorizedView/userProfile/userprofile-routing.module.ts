
import { NgModule } from '@angular/core';
import {  RouterModule, Routes } from '@angular/router';
import { authguardGuard } from '../../../services/AuthGuard/authguard.guard';
import { UserProfileComponent } from './user-profile/userprofile.component';

const routes: Routes = [

  {
    path: '',
    component: UserProfileComponent,
    canActivate: [authguardGuard]
  },
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class UserProfileRoutingModule { }
