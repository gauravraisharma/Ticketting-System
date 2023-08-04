import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { authguardGuard } from '../../../services/AuthGuard/authguard.guard';
import { CompnayManagementComponent } from './compnay-management/compnay-management.component';
import { roleGuard } from '../../../services/AuthGuard/role.guard';


const routes: Routes = [

  {
    path: '',
    component: CompnayManagementComponent,
    canActivate: [authguardGuard, roleGuard],
    data: { userTypes: ['SUPERADMIN'] }
  },
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class CompanymanagementRoutingModule { }
