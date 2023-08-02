
import { NgModule } from '@angular/core';
import {  RouterModule, Routes } from '@angular/router';
import { adminguardGuard } from '../../../services/AuthGuard/adminguard.guard';
import { authguardGuard } from '../../../services/AuthGuard/authguard.guard';
import { AddUserComponent } from './add-user/add-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { UserlistingComponent } from './userlisting/userlisting.component';
const routes: Routes = [
  {
    path: '',
    component: UserlistingComponent,
    canActivate: [adminguardGuard,authguardGuard]
  },
  {
    path: 'adduser',
    component: AddUserComponent,
    canActivate: [adminguardGuard,authguardGuard]
  },
  {
    path: 'edituser/:id',
    component: EditUserComponent,
    canActivate: [adminguardGuard,authguardGuard]
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class UserRoutingModule { }
