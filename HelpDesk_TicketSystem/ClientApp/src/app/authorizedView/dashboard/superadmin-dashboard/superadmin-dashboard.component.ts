import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/commonServcices/common-service.service';


@Component({
  selector: 'app-superadmin-dashboard',
  templateUrl: './superadmin-dashboard.component.html',
  styleUrls: ['./superadmin-dashboard.component.css']
})
export class SuperadminDashboardComponent implements OnInit {
  ticketCount = 0;
  userCount = 0;
  isLoading = false;
  userType = '';
  constructor(private commonService: CommonService,
    private router: Router,) { }

  ngOnInit() {
    this.userType = sessionStorage.getItem('userType').toUpperCase();
    this.GetTotalDashboardCounts();
  }
  GetTotalDashboardCounts() {
    this.isLoading = true;
    this.commonService.GetTotalDashboardCounts(sessionStorage.getItem('userId')!, parseInt(sessionStorage.getItem('companyId'))).subscribe((response: any) => {
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
