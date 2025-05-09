
import { NgModule } from '@angular/core';
import {  RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PageNotAuthorizedComponent } from './page-not-authorized/page-not-authorized.component';
import { PageInternalErrorComponent } from './page-internal-error/page-internal-error.component';
import { authguardGuard } from 'src/services/AuthGuard/authguard.guard';
import { roleGuard } from 'src/services/AuthGuard/role.guard';

const appRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/homepage.module').then(m => m.HomePageModule),
  },
  {
    path: '',
    loadChildren: () => import('./user-authentication/user-authentication.module').then(m => m.UserAuthenticationModule),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./authorizedView/dashboard/dashboard.module').then(m => m.DashboardModule),
  }, {
    path: 'ticket',
    loadChildren: () => import('./authorizedView/ticket/ticket.module').then(m => m.TicketModule),
  },
  {
    path: 'users',
    loadChildren: () => import('./authorizedView/userManagement/user.module').then(m => m.UserModule),
  },
  {
    path: 'userProfile',
    loadChildren: () => import('./authorizedView/userProfile/userprofile.module').then(m => m.UserProfileModule),
  },
  {
    path: 'companys',
    loadChildren: () => import('./authorizedView/companymanagement/companymanagement.module').then(m => m.CompanymanagementModule),
  },
  {
    path: 'settings',
    loadChildren: () => import('./authorizedView/settings/settings.module').then(m => m.SettingsModule),
  },
  {
    path: 'externalconnect',
    loadChildren: () => import('./connectwithClient/connectwithClient.module').then(m => m.connectwithClientModule),

  },
  {
    path: 'chat',
    loadChildren: () => import('./authorizedView/chat/chat.module').then(m => m.ChatModule),

  },
  {
    path: 'developersGuide',
    loadChildren: () => import('./developersGuide/developers-guide.module').then(m => m.DevelopersGuideModule),
    },
  {
    path: 'pageNotAuthorized',
    component: PageNotAuthorizedComponent
  },
  {
    path: 'internalError',
    component: PageInternalErrorComponent
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
