
import { NgModule } from '@angular/core';
import {  RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const appRoutes: Routes = [
  {
    path: '',
    component: HomepageComponent,
  },
  {
    path: 'user-authenticaton',
    loadChildren: () => import('./user-authentication/user-authentication.module').then(m => m.UserAuthenticationModule)
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
    path: 'userProfile',
    loadChildren: () => import('./authorizedView/userProfile/userprofile.module').then(m => m.UserProfileModule)
  },
  {
    path: 'companys',
    loadChildren: () => import('./authorizedView/companymanagement/companymanagement.module').then(m => m.CompanymanagementModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./authorizedView/settings/settings.module').then(m => m.SettingsModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./authorizedView/chat/chat.module').then(m => m.ChatModule)
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
