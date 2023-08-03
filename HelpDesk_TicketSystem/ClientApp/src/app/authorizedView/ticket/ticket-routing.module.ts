import { NgModule } from '@angular/core';
import {  RouterModule, Routes } from '@angular/router';
import { authguardGuard } from '../../../services/AuthGuard/authguard.guard';
import { SuperAdminGuard } from '../../../services/AuthGuard/superadmin.guard';
import { AddTicketComponent } from './add-ticket/add-ticket.component';
import { TicketListComponent } from './ticket-list/ticket-list.component';
import { ViewTicketComponent } from './view-ticket/view-ticket.component';

const routes: Routes = [
  {
    path: '',
    component: TicketListComponent,
    canActivate: [SuperAdminGuard, authguardGuard],
    data: { allowedRoles: ['ADMIN','NORMALUSER'] }
  },
  {
    path: 'addTicket',
    component: AddTicketComponent,
    canActivate: [SuperAdminGuard, authguardGuard],
     data: { allowedRoles: ['NORMALUSER'] }
  },
  {
    path: 'viewTicket/:id',
    component: ViewTicketComponent,
    canActivate: [SuperAdminGuard, authguardGuard],
    data: { allowedRoles: ['ADMIN', 'NORMALUSER'] }
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TicketRoutingModule { }
