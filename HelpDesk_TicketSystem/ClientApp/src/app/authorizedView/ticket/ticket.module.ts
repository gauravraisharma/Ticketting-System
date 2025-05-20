import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketListComponent } from './ticket-list/ticket-list.component';
import { AddTicketComponent } from './add-ticket/add-ticket.component';
import { ViewTicketComponent } from './view-ticket/view-ticket.component';
import { TicketRoutingModule } from './ticket-routing.module';
import { SharedModule } from '../../sharedComponent/shared.module';
import { TimeZonePipe } from '../../../pipe/time-zone.pipe';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';



@NgModule({
  declarations: [
    TicketListComponent,
    AddTicketComponent,
    ViewTicketComponent,
  ],
  imports: [
    CommonModule,
    TicketRoutingModule,
    SharedModule,
    FormsModule,
    MatTooltipModule
  ]
})
export class TicketModule { }
