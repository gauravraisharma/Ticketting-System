import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TicketService } from '../../../../services/ticketServices/ticketservcie.service';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent implements AfterViewInit, OnInit {
 
  displayedColumns: string[] = ['ticketNumber', 'subject', 'createdOn', 'priority','status','action'];
  dataSource = new MatTableDataSource<ticketModel>([]);
  isLoading = false
  data1 = [];
  userType = sessionStorage.getItem('userType');
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private ticketService: TicketService,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit(){

    this.getTickets();
  }
  ngAfterViewInit() {
   // this.dataSource.paginator = this.paginator;
   
  }
  getTickets() {
    this.isLoading = true;
    this.ticketService.GetTicket(sessionStorage.getItem('userId')!,parseInt(sessionStorage.getItem('companyId'))).subscribe((response: any) => {
      console.log('prio', response)
      this.data1 = response;
      this.dataSource = new MatTableDataSource<ticketModel>(response);
      this.dataSource.paginator = this.paginator
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
