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
  displayedColumns: string[] = ['Ticket Number', 'Subject', 'Created On', 'Priority','Status','Action'];
  dataSource:any[]=[];
  isLoading = false
  data1 = [];
  userType = localStorage.getItem('userType');
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  selectedPriority: string;
  selectedStatus: string;
  searchQuery: string;

  priorityList:any[] = [
    {id:1,label: "LOW"},
    {id:2,label: "MEDIUM"},
    {id:3,label : "HIGH"}
  ]
  statusList:any[] = [
    {id:1,label: "OPEN"},
    {id:2,label: "CLOSE"},
  ]
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
    this.ticketService.GetTicket(localStorage.getItem('userId')!, parseInt(localStorage.getItem('companyId')), this.searchQuery || null, this.selectedPriority || null, this.selectedStatus|| null).subscribe((response: any) => {
      console.log('prio', response)
      this.data1 = response;
      this.dataSource = response;
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
    })
  }
  getSeverity(status: string) {
    switch (status) {
        case 'LOW':
            return 'info';
        case 'MEDIUM':
            return 'warning';
        case 'HIGH':
            return 'danger';
        default:
            return 'info'; 
    }
}
clearFilters(){
  this.selectedPriority = null;
  this.selectedStatus = null;
  this.searchQuery = '';
  this.getTickets();
}


}

export interface ticketModel {
  subject: string;
  ticketNumber: number;
  createdOn: string;
  priority: string;
  status: string;
}


