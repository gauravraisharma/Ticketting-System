
import { NgModule } from '@angular/core';
import {  RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { authguardGuard } from '../services/AuthGuard/authguard.guard';
import { DashboardComponent } from './authorizedView/dashboard/dashboard.component';
import { TicketListComponent } from './authorizedView/ticket/ticket-list/ticket-list.component';
import { AddTicketComponent } from './authorizedView/ticket/add-ticket/add-ticket.component';
import { ViewTicketComponent } from './authorizedView/ticket/view-ticket/view-ticket.component';
import { UserlistingComponent } from './authorizedView/userManagement/userlisting/userlisting.component';
import { AddUserComponent } from './authorizedView/userManagement/add-user/add-user.component';
import { HomepageComponent } from './homepage/homepage.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const appRoutes: Routes = [
  {
    path: '',
    component: HomepageComponent,
  },
  {
    path: 'login',
    loadChildren: () => import('./login-page/login.module').then(m => m.LoginModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./authorizedView/dashboard/dashboard.module').then(m => m.DashboardModule)
  }, {
    path: 'ticket',
    loadChildren: () => import('./authorizedView/ticket/ticket.module').then(m => m.TicketModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./authorizedView/userManagement/user.module').then(m => m.UserModule)
  },
  {
    path: '**',
    pathMatch: 'full',
    component: PageNotFoundComponent
  },
]

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
