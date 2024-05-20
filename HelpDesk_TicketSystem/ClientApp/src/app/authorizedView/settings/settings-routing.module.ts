import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authguardGuard } from '../../../services/AuthGuard/authguard.guard';
import { roleGuard } from '../../../services/AuthGuard/role.guard';
import { SettingsComponent } from './settings/settings.component';
import { RegisterapplicationComponent } from './registerapplication/registerapplication.component';


const routes: Routes = [

  {
    path: '',
    component: SettingsComponent,
    canActivate: [authguardGuard, roleGuard],
    data: { userTypes: ['ADMIN'] }
  },
  {
    path: 'registerapplication',
    component: RegisterapplicationComponent, 
    canActivate: [authguardGuard, roleGuard], 
    data: { userTypes: ['ADMIN'] } 
  }
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
