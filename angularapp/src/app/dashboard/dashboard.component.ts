import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../services/ticketServices/ticketservcie.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  ticketCount = 0;
  isLoading = false;
  constructor(private ticketService: TicketService,
    private router: Router,) { }

  ngOnInit() {
    this.GetTotalTicketCount();
  }
  GetTotalTicketCount() {
    this.isLoading = true;
    this.ticketService.GetTotalTicketCount(sessionStorage.getItem('userId')!).subscribe((response: any) => {
      this.ticketCount = response.message;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
    })
  }
  gotToTicketList() {
    this.router.navigate(['/ticket'])
  }
}
