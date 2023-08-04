import { NgModule } from '@angular/core';
import {  RouterModule, Routes } from '@angular/router';
import { authguardGuard } from '../../../services/AuthGuard/authguard.guard';
import { roleGuard } from '../../../services/AuthGuard/role.guard';
import { AddTicketComponent } from './add-ticket/add-ticket.component';
import { TicketListComponent } from './ticket-list/ticket-list.component';
import { ViewTicketComponent } from './view-ticket/view-ticket.component';

const routes: Routes = [
  {
    path: '',
    component: TicketListComponent,
    canActivate: [authguardGuard, roleGuard],

    data: { userTypes: ['ADMIN','NORMALUSER'] }
  },
  {
    path: 'addTicket',
    component: AddTicketComponent,
    canActivate: [authguardGuard, roleGuard],

    data: { userTypes: [ 'NORMALUSER'] }
  },
  {
    path: 'viewTicket/:id',
    component: ViewTicketComponent,
    canActivate: [authguardGuard, roleGuard],
    data: { userTypes: ['ADMIN', 'NORMALUSER'] }
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TicketRoutingModule { }
