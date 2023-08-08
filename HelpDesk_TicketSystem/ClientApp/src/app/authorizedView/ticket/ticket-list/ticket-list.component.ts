import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { TicketService } from '../../../../services/ticketServices/ticketservcie.service';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent implements AfterViewInit, OnInit {
  currentTimeZone: string = localStorage.getItem('timeZone');
  displayedColumns: string[] = ['ticketNumber', 'subject', 'createdOn', 'priority','status','action'];
  dataSource = new MatTableDataSource<ticketModel>([]);
  isLoading = false
  data1 = [];
  userType = localStorage.getItem('userType');
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private ticketService: TicketService,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.getTickets();
  }
  ngAfterViewInit() {
   // this.dataSource.paginator = this.paginator;
   
  }
  getTickets() {
    this.isLoading = true;
    this.ticketService.GetTicket(localStorage.getItem('userId')!, parseInt(localStorage.getItem('companyId'))).subscribe((response: any) => {
      console.log('prio', response)
      this.data1 = response;
      this.dataSource = new MatTableDataSource<ticketModel>(response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
    })
  }
}

export interface ticketModel {
  subject: string;
  ticketNumber: number;
  createdOn: string;
  priority: string;
  status: string;
}


