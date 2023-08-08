
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../../../services/dashboardService/dashboard.service';

@Component({
  selector: 'app-company-admin-dashboard',
  templateUrl: './company-admin-dashboard.component.html',
  styleUrls: ['./company-admin-dashboard.component.css']
})
export class CompanyAdminDashboardComponent
  implements OnInit {
  ticketCount = 0;
  userCount = 0;
  isLoading = false;
  userType = '';
  constructor(private dashboardService: DashboardService,
    private router: Router,) { }

  ngOnInit() {
    this.userType = localStorage.getItem('userType').toUpperCase();
    this.GetTotalDashboardCounts();
  }
  GetTotalDashboardCounts() {
    this.isLoading = true;
    this.dashboardService.GetUserAndTicketCount(localStorage.getItem('userId')!, parseInt(localStorage.getItem('companyId'))).subscribe((response: any) => {
      this.ticketCount = response.toatlTickets;
      this.userCount = response.toatlUsers;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
    })
  }
  gotToTicketList() {
    this.router.navigate(['/ticket'])
  }
  gotToUserList() {
    this.router.navigate(['/users'])
  }
}

