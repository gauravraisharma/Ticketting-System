import { NgModule } from '@angular/core';
import {  RouterModule, Routes } from '@angular/router';
import { authguardGuard } from '../../../services/AuthGuard/authguard.guard';
import { SuperAdminGuard } from '../../../services/AuthGuard/superadmin.guard';
import { AddUserComponent } from './add-user/add-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { UserlistingComponent } from './userlisting/userlisting.component';
const routes: Routes = [
  {
    path: '',
    component: UserlistingComponent,
    canActivate: [SuperAdminGuard, authguardGuard],
    data: { allowedRoles: ['ADMIN'] }
  },
  {
    path: 'adduser',
    component: AddUserComponent,
    canActivate: [SuperAdminGuard, authguardGuard],
    data: { allowedRoles: ['ADMIN'] }
  },
  {
    path: 'edituser/:id',
    component: EditUserComponent,
    canActivate: [SuperAdminGuard, authguardGuard],
    data: { allowedRoles: ['ADMIN'] }
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class UserRoutingModule { }
