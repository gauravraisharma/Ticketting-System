
import { NgModule } from '@angular/core';
import {  RouterModule, Routes } from '@angular/router';
import { adminguardGuard } from '../../../services/AuthGuard/adminguard.guard';
import { authguardGuard } from '../../../services/AuthGuard/authguard.guard';
import { SuperAdminGuard } from '../../../services/AuthGuard/superadmin.guard';
import { useradminGuard } from '../../../services/AuthGuard/useradmin.guard';
import { userguardGuard } from '../../../services/AuthGuard/userguard.guard';
import { AddTicketComponent } from './add-ticket/add-ticket.component';
import { TicketListComponent } from './ticket-list/ticket-list.component';
import { ViewTicketComponent } from './view-ticket/view-ticket.component';

const routes: Routes = [
  {
    path: '',
    component: TicketListComponent,
    canActivate: [useradminGuard,authguardGuard]
  },
  {
    path: 'addTicket',
    component: AddTicketComponent,
    canActivate: [userguardGuard,authguardGuard]
  },
  {
    path: 'viewTicket/:id',
    component: ViewTicketComponent,
    canActivate: [useradminGuard,authguardGuard]
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TicketRoutingModule { }
