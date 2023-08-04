import { NgModule } from '@angular/core';
import {  RouterModule, Routes } from '@angular/router';
import { authguardGuard } from '../../../services/AuthGuard/authguard.guard';
import { roleGuard } from '../../../services/AuthGuard/role.guard';
import { AddUserComponent } from './add-user/add-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { UserlistingComponent } from './userlisting/userlisting.component';
const routes: Routes = [
  {
    path: '',
    component: UserlistingComponent,
    canActivate: [authguardGuard, roleGuard],
    data: { userTypes: ['ADMIN'] }
  },
  {
    path: 'adduser',
    component: AddUserComponent,
    canActivate: [authguardGuard, roleGuard],
     data: { userTypes: ['ADMIN'] }
  },
  {
    path: 'edituser/:id',
    component: EditUserComponent,
    canActivate: [authguardGuard, roleGuard],
    data: { userTypes: ['ADMIN'] }
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class UserRoutingModule { }
