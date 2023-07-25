
import { NgModule } from '@angular/core';
import {  RouterModule, Routes } from '@angular/router';
import { authguardGuard } from '../../../services/AuthGuard/authguard.guard';
import { AddUserComponent } from './add-user/add-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { UserlistingComponent } from './userlisting/userlisting.component';
const routes: Routes = [
  {
    path: '',
    component: UserlistingComponent,
    canActivate: [authguardGuard]
  },
  {
    path: 'adduser',
    component: AddUserComponent,
    canActivate: [authguardGuard]
  },
  {
    path: 'edituser/:id',
    component: EditUserComponent,
    canActivate: [authguardGuard]
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class UserRoutingModule { }
